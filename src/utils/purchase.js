import { Contract, MaxUint256, parseUnits } from "ethers";
import PresaleABI from "../contracts/PresaleContractAbi.json";
import ERC20ABI from "../contracts/TokenContractAbi.json";
import { TOKENS } from "../contracts/tokens";

// Helper function to check STAYX token balance
export async function checkStayxBalance(provider, userAddress, stayxTokenAddress) {
  try {
    const tokenContract = new Contract(stayxTokenAddress, ERC20ABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    const decimals = await tokenContract.decimals();
    const formattedBalance = balance.div(parseUnits("1", decimals));
    return {
      raw: balance.toString(),
      formatted: formattedBalance.toString(),
      decimals: decimals
    };
  } catch (error) {
    console.log('Error checking STAYX balance:', error.message);
    return null;
  }
}

// Helper function to get price from contract
export async function getPriceFromContract(provider, presaleAddress) {
  try {
    const presale = new Contract(presaleAddress, PresaleABI, provider);
    
    // Check if Chainlink is configured
    const priceFeeds = await presale.priceFeeds("0x0000000000000000000000000000000000000000");
    const [enabled, feed, maxStale] = priceFeeds;
    
    if (enabled && feed !== "0x0000000000000000000000000000000000000000") {
      // Use Chainlink price feed
      const feedContract = new Contract(feed, [
        "function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)",
        "function decimals() view returns (uint8)"
      ], provider);
      
      const [roundId, price, startedAt, updatedAt, answeredInRound] = await feedContract.latestRoundData();
      const decimals = await feedContract.decimals();
      
      // Convert to 18 decimals
      const price18 = price.mul(parseUnits("1", 18 - decimals));
      return price18;
    } else {
      // Use fixed USD price from tokenInfo
      const tokenInfo = await presale.tokenInfo("0x0000000000000000000000000000000000000000");
      const usdPrice18 = tokenInfo.usdPrice; // Already in 18 decimals
      return usdPrice18;
    }
  } catch (error) {
    console.log('Error getting price from contract:', error.message);
    // Fallback to a default price (e.g., $3000 for ETH)
    return parseUnits("3000", 18);
  }
}

export async function buy({ provider, user, chainId, presaleAddress, payAssetKey, amountHuman }) {
  console.log('=== PURCHASE DEBUG ===');
  console.log('chainId:', chainId);
  console.log('presaleAddress:', presaleAddress);
  console.log('payAssetKey:', payAssetKey);
  console.log('amountHuman:', amountHuman);
  console.log('user:', user);
  
  const signer = await provider.getSigner();
  const presale = new Contract(presaleAddress, PresaleABI, signer);
  
  // Check if contract exists
  const code = await provider.getCode(presaleAddress);
  if (code === '0x') {
    throw new Error(`No contract found at address ${presaleAddress} on chain ${chainId}`);
  }
  
  // Get token configuration
  const chainTokens = TOKENS[chainId];
  if (!chainTokens) throw new Error("Unsupported chain: " + chainId);
  const tokenCfg = chainTokens[payAssetKey];
  if (!tokenCfg) throw new Error("Unsupported pay asset on this chain: " + payAssetKey);
  
  console.log('Token config:', tokenCfg);

  if (tokenCfg.kind === "native") {
    // Handle native tokens (ETH, BNB, MATIC, AVAX)
    return await buyWithNativeToken(presale, amountHuman, tokenCfg);
  } else {
    // Handle ERC20 tokens (USDC, USDT)
    return await buyWithERC20Token(presale, amountHuman, tokenCfg, presaleAddress, user);
  }
}

// Handle native token purchases (ETH, BNB, etc.)
async function buyWithNativeToken(presale, amountHuman, tokenCfg) {
  console.log('=== NATIVE TOKEN PURCHASE ===');
  console.log('Token:', tokenCfg.symbol);
  console.log('Amount:', amountHuman);
  
  const value = parseUnits(amountHuman, 18);
  console.log('Value in wei:', value.toString());
  
  try {
    // Try with manual gas limit to bypass estimation issues
    const tx = await presale.buyWithBNB({ 
      value,
      gasLimit: 500000 // Set a reasonable gas limit
    });
    console.log('Transaction submitted:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error('Native token purchase failed:', error);
    throw error;
  }
}

// Handle ERC20 token purchases (USDC, USDT)
async function buyWithERC20Token(presale, amountHuman, tokenCfg, presaleAddress, user) {
  console.log('=== ERC20 TOKEN PURCHASE ===');
  console.log('Token:', tokenCfg.symbol);
  console.log('Token Address:', tokenCfg.address);
  console.log('Amount:', amountHuman);
  console.log('Decimals:', tokenCfg.decimals);
  
  const erc20 = new Contract(tokenCfg.address, ERC20ABI, presale.signer);
  const amount = parseUnits(amountHuman, tokenCfg.decimals);
  
  // Check user's token balance
  try {
    const balance = await erc20.balanceOf(user);
    console.log('User balance:', balance.toString());
    if (balance.lt(amount)) {
      throw new Error(`Insufficient ${tokenCfg.symbol} balance. You have ${balance.toString()} but need ${amount.toString()}`);
    }
  } catch (balanceError) {
    console.error('Balance check failed:', balanceError.message);
    throw new Error(`Cannot check ${tokenCfg.symbol} balance. Make sure you have ${tokenCfg.symbol} tokens in your wallet.`);
  }

  try {
    // Step 1: Approve the presale contract to spend tokens
    console.log('Step 1: Approving tokens...');
    const approveTx = await erc20.approve(presaleAddress, MaxUint256, {
      gasLimit: 100000 // Manual gas limit for approval
    });
    console.log('Approval transaction:', approveTx.hash);
    await approveTx.wait();
    console.log('Approval confirmed');
    
    // Step 2: Call buyWithToken
    console.log('Step 2: Purchasing tokens...');
    const buyTx = await presale.buyWithToken(tokenCfg.address, amount, {
      gasLimit: 500000 // Manual gas limit for purchase
    });
    console.log('Purchase transaction:', buyTx.hash);
    const receipt = await buyTx.wait();
    console.log('Purchase confirmed:', receipt.transactionHash);
    return receipt;
    
  } catch (error) {
    console.error('ERC20 purchase failed:', error);
    
    // Check if it's an allowance issue and retry
    const errorMsg = (error?.reason || error?.message || "").toLowerCase();
    if (errorMsg.includes("allowance") || errorMsg.includes("transfer amount exceeds allowance")) {
      console.log('Retrying with fresh approval...');
      try {
        const retryApproveTx = await erc20.approve(presaleAddress, MaxUint256, {
          gasLimit: 100000
        });
        await retryApproveTx.wait();
        
        const retryBuyTx = await presale.buyWithToken(tokenCfg.address, amount, {
          gasLimit: 500000
        });
        const retryReceipt = await retryBuyTx.wait();
        return retryReceipt;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        throw retryError;
      }
    }
    
    throw error;
  }
}
