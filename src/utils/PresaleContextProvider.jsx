import React, {
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { parseUnits, formatUnits, ethers } from "ethers";
import {
  useAccount,
  useChainId,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { erc20Abi } from "viem";
import { CHAINS } from "../contracts/chainConfig";
import { TOKENS } from "../contracts/tokens";
import { buy as buyService } from "./purchase";
import { getQuote } from "./quotes";
import PresaleContext from "./PresaleContext";
import PresaleABIraw from "../contracts/PresaleContractAbi.json";
export default function PresaleContextProvider({ children }) {
  const { chain, isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [selectedChainId, setSelectedChainId] = useState(chainId || 56); // Use current chain or default to BNB
  const [selectedPayAssetKey, setSelectedPayAssetKey] = useState("NATIVE");
  const [amountHuman, setAmountHuman] = useState("");

  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const [quoteUsd, setQuoteUsd] = useState("0");
  const [quoteStayx, setQuoteStayx] = useState("0");

  const PresaleABI = PresaleABIraw.default || PresaleABIraw;

  // Update chainId when user switches networks
  useEffect(() => {
    console.log("=== CHAIN DEBUG ===");
    console.log("chain from useAccount:", chain);
    console.log("chainId from useChainId:", chainId);
    console.log("current selectedChainId:", selectedChainId);
    if (chainId) {
      console.log("Setting selectedChainId to:", chainId);
      setSelectedChainId(chainId);
    }
    console.log("==================");
  }, [chainId, selectedChainId]);

  const chainMeta = useMemo(
    () => Object.values(CHAINS).find((c) => c.chainId === selectedChainId),
    [selectedChainId]
  );
  const payAsset = useMemo(
    () => (TOKENS[selectedChainId] || {})[selectedPayAssetKey] || null,
    [selectedChainId, selectedPayAssetKey]
  );

  const handlePaymentInput = (v) => setAmountHuman(v);
  const makeEmptyInputs = () => ({ token: "", amount: "" });
  const [userBalance, setUserBalance] = useState("0");

  const provider = useMemo(() => {
    // Try wagmi walletClient first (works better on mobile)
    if (walletClient) {
      console.log("Using wagmi walletClient for provider");
      return new ethers.BrowserProvider(walletClient);
    }

    // Fallback to window.ethereum
    if (typeof window !== "undefined" && window.ethereum) {
      console.log("Using window.ethereum for provider");
      return new ethers.BrowserProvider(window.ethereum);
    }

    console.log("No provider available");
    return null;
  }, [walletClient, selectedChainId]);

  const presaleAddress = chainMeta?.presale;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setQuoteError(null);
      if (
        !provider ||
        !presaleAddress ||
        !amountHuman ||
        Number(amountHuman) <= 0
      ) {
        setQuoteUsd("0");
        setQuoteStayx("0");
        return;
      }
      setIsQuoting(true);
      try {
        const q = await getQuote({
          provider,
          chainId: selectedChainId,
          presaleAddress,
          assetKey: selectedPayAssetKey,
          amountHuman,
        });
        if (!cancelled) {
          setQuoteUsd(q.usdFormatted);
          setQuoteStayx(q.stayxFormatted);
        }
      } catch (e) {
        if (!cancelled) {
          setQuoteError(e?.message || "Quote failed");
          setQuoteUsd("0");
          setQuoteStayx("0");
        }
      } finally {
        if (!cancelled) setIsQuoting(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [
    provider,
    presaleAddress,
    selectedChainId,
    selectedPayAssetKey,
    amountHuman,
  ]);

  const buyToken = useCallback(
    async (overrideAmount = null, overrideChainId = null, tokenInfo = null) => {
      console.log("=== BUYTOKEN DEBUG ===");
      console.log("selectedChainId in buyToken:", selectedChainId);
      console.log("chainId from useChainId in buyToken:", chainId);
      console.log("chain from useAccount in buyToken:", chain);
      console.log("isConnected from useAccount:", isConnected);
      console.log("address from useAccount:", address);
      console.log("overrideChainId:", overrideChainId);
      console.log("presaleAddress:", presaleAddress);
      console.log("selectedPayAssetKey:", selectedPayAssetKey);
      console.log("========================");

      if (!provider) throw new Error("No provider");
      if (!presaleAddress) throw new Error("Missing presale address");
      if (!tokenInfo) throw new Error("Select asset");

      const amountToUse = overrideAmount || amountHuman;
      if (!amountToUse || Number(amountToUse) <= 0)
        throw new Error("Enter amount");

      const code = await provider.getCode(presaleAddress);
      if (code === "0x") {
        throw new Error(
          `No contract found at address ${presaleAddress} on chain ${chainId}`
        );
      }

      if (!tokenInfo) throw new Error("Unsupported pay asset on this chain: ");

      if (tokenInfo.isNative) {
        // ===== Native purchase =====
        try {
          const balance = await publicClient.getBalance({ address });
          if (balance === 0n) {
            throw new Error("Insufficient native token balance");
          }
          console.log("User native balance:", formatUnits(balance, 18));

          if (balance < parseUnits(amountToUse, tokenInfo.decimals)) {
            throw new Error(`Insufficient ${tokenInfo.symbol} balance`);
          }

          const value = parseUnits(amountToUse, tokenInfo.decimals);

          const simulateContract = await publicClient.simulateContract({
            account: address,
            address: presaleAddress,
            abi: PresaleABI,
            functionName: "buyWithNative",
            args: [],
            value,
          });

          console.log(simulateContract, "simulateContract");

          const txHash = await walletClient.writeContract({
            account: address,
            address: presaleAddress,
            abi: PresaleABI,
            functionName: "buyWithNative",
            args: [],
            value,
          });

          const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
          });

          console.log("Native purchase confirmed:", receipt.transactionHash);
          return receipt;
        } catch (error) {
          console.error("Native token purchase failed:", error);
          throw error;
        }
      } else {
        // ===== ERC20 purchase =====
        try {
          const value = parseUnits(amountToUse, tokenInfo.decimals);
          const amountBN = BigInt(value.toString());

          const balance = await publicClient.readContract({
            address: tokenInfo.address,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          });

          // if (balance === 0n) {
          //   throw new Error(`Insufficient ${tokenInfo.symbol} balance`);
          // }
          // console.log(
          //   `User ${tokenCfg.symbol} balance:`,
          //   formatUnits(balance, tokenInfo.decimals)
          // );

          // if (balance < amountBN) {
          //   throw new Error("Insufficient token balance");
          // }

          // Check allowance
          const allowance = await publicClient.readContract({
            address: tokenInfo.address,
            abi: erc20Abi,
            functionName: "allowance",
            args: [address, presaleAddress],
          });

          if (allowance < amountBN) {
            console.log("Allowance insufficient, approving...");

            const approvalAmount = amountBN * 2n;
            const approveHash = await walletClient.writeContract({
              account: address,
              address: tokenInfo.address,
              abi: erc20Abi,
              functionName: "approve",
              args: [presaleAddress, approvalAmount],
            });

            await publicClient.waitForTransactionReceipt({ hash: approveHash });

            const allowance = await publicClient.readContract({
              address: tokenInfo.address,
              abi: erc20Abi,
              functionName: "allowance",
              args: [address, presaleAddress],
            });

            console.log("Approval confirmed");
          } else {
            console.log("Sufficient allowance already granted");
          }

          const simulateContract = await publicClient.simulateContract({
            account: address,
            address: presaleAddress,
            abi: PresaleABI,
            functionName: "buyWithToken",
            args: [tokenInfo.address, amountBN],
            value: 0n,
          });

          console.log(simulateContract, "simulateContract");

          // Call presale contract
          const txHash = await walletClient.writeContract({
            account: address,
            address: presaleAddress,
            abi: PresaleABI,
            functionName: "buyWithToken",
            args: [tokenInfo.address, amountBN],
            value: 0n,
          });

          const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
          });

          console.log("ERC20 purchase confirmed:", receipt.transactionHash);
          return receipt;
        } catch (error) {
          console.error("ERC20 token purchase failed:", error);
          throw error;
        }
      }
    },
    [
      provider,
      presaleAddress,
      selectedChainId,
      selectedPayAssetKey,
      amountHuman,
      chainId,
    ]
  );

  return (
    <PresaleContext.Provider
      value={{
        selectedChainId,
        setSelectedChainId,
        selectedPayAssetKey,
        setSelectedPayAssetKey,
        paymentAmount: amountHuman,
        handlePaymentInput,
        chainMeta,
        payAsset,
        isQuoting,
        quoteError,
        quoteUsd,
        quoteStayx,
        buyToken,
        makeEmptyInputs,
        userBalance,
        setUserBalance,
        raisedToken: 0,
        goalToken: 0,
      }}
    >
      {children}
    </PresaleContext.Provider>
  );
}

export function usePresaleData() {
  const ctx = useContext(PresaleContext);
  if (!ctx)
    throw new Error(
      "usePresaleData must be used within PresaleContextProvider"
    );
  return ctx;
}
