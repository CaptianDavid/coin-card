import { parseUnits, MaxUint256 } from "ethers";
import { Contract } from "ethers";
import PresaleABIraw from "../contracts/PresaleContractAbi.json";
import ERC20ABIraw from "../contracts/TokenContractAbi.json";
import { TOKENS } from "../contracts/tokens";

// Ensure ABI import works in both ESM/CJS builds
const PresaleABI = PresaleABIraw.default || PresaleABIraw;
const ERC20ABI = ERC20ABIraw.default || ERC20ABIraw;

export async function buy({ provider, user, chainId, presaleAddress, payAssetKey, amountHuman }) {
  console.log("=== PURCHASE DEBUG ===");
  console.log("chainId:", chainId);
  console.log("presaleAddress:", presaleAddress);
  console.log("payAssetKey:", payAssetKey);
  console.log("amountHuman:", amountHuman);
  console.log("user:", user);
  console.log("provider exists:", !!provider);
  console.log("===============================");

  // Check if contract exists
  const code = await provider.getCode(presaleAddress);
  if (code === "0x") {
    throw new Error(`No contract found at address ${presaleAddress} on chain ${chainId}`);
  }

  // Get token configuration
  const chainTokens = TOKENS[chainId];
  if (!chainTokens) throw new Error("Unsupported chain: " + chainId);
  const tokenCfg = chainTokens[payAssetKey];
  if (!tokenCfg) throw new Error("Unsupported pay asset on this chain: " + payAssetKey);

  console.log("Token config:", tokenCfg);

  if (tokenCfg.kind === "native") {
    return await buyWithNativeToken(presaleAddress, amountHuman, tokenCfg, provider);
  } else {
    return await buyWithERC20Token(presaleAddress, amountHuman, tokenCfg, provider);
  }
}

// === Handle native token purchases (BNB/ETH/etc.) ===
async function buyWithNativeToken(presaleAddress, amountHuman, tokenCfg, provider) {
  const value = parseUnits(amountHuman, 18);
  const signer = await provider.getSigner();
  const presale = new Contract(presaleAddress, PresaleABI, signer);

  console.log("=== NATIVE TOKEN PURCHASE ===");
  console.log("Symbol:", tokenCfg.symbol);
  console.log("Amount:", amountHuman, "→", value.toString(), "wei");

  try {
    let tx;
    try {
      const est = await presale.estimateGas.buyWithBNB({ value });
      tx = await presale.buyWithBNB({
        value,
        gasLimit: (est * 12n) / 10n, // +20% buffer
      });
    } catch (err) {
      console.warn("estimateGas failed for buyWithBNB, using fallback gas:", err);
      tx = await presale.buyWithBNB({
        value,
        gasLimit: 300000n,
      });
    }

    const receipt = await tx.wait();
    console.log("Native buy confirmed:", receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error("Native token purchase failed:", error);
    throw error;
  }
}

// === Handle ERC20 token purchases (USDT/USDC/etc.) ===
async function buyWithERC20Token(presaleAddress, amountHuman, tokenCfg, provider) {
  const amount = parseUnits(amountHuman, tokenCfg.decimals);
  const signer = await provider.getSigner();
  const presale = new Contract(presaleAddress, PresaleABI, signer);
  const erc20 = new Contract(tokenCfg.address, ERC20ABI, signer);

  console.log("=== ERC20 TOKEN PURCHASE ===");
  console.log("Symbol:", tokenCfg.symbol);
  console.log("Amount:", amountHuman, "→", amount.toString(), "raw units");

  try {
    const owner = await signer.getAddress();
    const allowance = await erc20.allowance(owner, presaleAddress);

    // ✅ FIX: Convert to BigNumber and use .lt for comparison
    const allowanceBN = BigInt(allowance.toString());
    const amountBN = BigInt(amount.toString());
    
    if (allowanceBN < amountBN) {
      console.log("Allowance insufficient, approving amount...");
      // Use 2x the required amount instead of MaxUint256 to avoid security warnings
      const approvalAmount = amount * 2n;
      try {
        const estApprove = await erc20.estimateGas.approve(presaleAddress, approvalAmount);
        const approveTx = await erc20.approve(presaleAddress, approvalAmount, {
          gasLimit: (estApprove * 12n) / 10n,
        });
        await approveTx.wait();
      } catch (err) {
        console.warn("estimateGas failed for approve, using fallback gas:", err);
        const approveTx = await erc20.approve(presaleAddress, approvalAmount, {
          gasLimit: 100000n,
        });
        await approveTx.wait();
      }
      console.log("Approval confirmed");
    } else {
      console.log("Sufficient allowance already granted");
    }

    // Step 2: Buy with token
    let buyTx;
    try {
      const estBuy = await presale.estimateGas.buyWithToken(tokenCfg.address, amount);
      buyTx = await presale.buyWithToken(tokenCfg.address, amount, {
        gasLimit: (estBuy * 12n) / 10n,
      });
    } catch (err) {
      console.warn("estimateGas failed for buyWithToken, using fallback gas:", err);
      buyTx = await presale.buyWithToken(tokenCfg.address, amount, {
        gasLimit: 300000n,
      });
    }

    const receipt = await buyTx.wait();
    console.log("ERC20 buy confirmed:", receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error("ERC20 purchase failed:", error);
    throw error;
  }
}
