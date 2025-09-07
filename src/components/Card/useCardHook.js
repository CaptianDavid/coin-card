import { useEffect, useState } from "react";
import { coins } from "../../helpers";
import { usePresaleData } from "../../utils/PresaleContextProvider";

const BONUS_PERCENT = 10;
const STAYX_PRESALE_PRICE = 0.001;
const STABLECOINS = ["USDT", "USDC", "BUSD"];

const useCardHook = (chainId) => {
  const {
    selectedChainId,
    selectedPayAssetKey,
    paymentAmount,
    handlePaymentInput,
    quoteUsd,
    quoteStayx,
    buyToken: presaleBuyToken,
    userBalance,
    setUserBalance,
  } = usePresaleData();
  
  const [stageEnd, setStageEnd] = useState(1759284000);

  const [selected, setSelected] = useState(
    coins.find((c) => c.symbol === "BNB")
  );
  const [amount, setAmount] = useState("");
  const [prices, setPrices] = useState({});
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    const ids = coins.map((t) => t.id).join(",");
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    )
      .then((res) => res.json())
      .then(setPrices)
      .catch(console.error);
  }, []);

  // Fallback prices if API fails
  const FALLBACK_PRICES = {
    "binancecoin": 600, // BNB fallback price
    "ethereum": 3000,   // ETH fallback price
    "matic-network": 0.8, // MATIC fallback price
    "avalanche-2": 30,  // AVAX fallback price
    "tether": 1,        // USDT fallback price
    "usd-coin": 1,      // USDC fallback price
  };

  const priceUsd = STABLECOINS.includes(selected.symbol)
    ? 1
    : prices[selected.id]?.usd || FALLBACK_PRICES[selected.id] || 0;
  const valueUsd = amount ? amount * priceUsd : ""; // ✅ empty if no input
  

  const getAmount = valueUsd ? valueUsd / STAYX_PRESALE_PRICE : 0;
  const bonusAmount = getAmount * (BONUS_PERCENT / 100);

  const buyNowHandle = () => {
    setIsBuyNow(!isBuyNow);
  };
  
  useEffect(() => {
    if (isBuyNow) {
      document.querySelector(".gittu-banner-card").classList.add("flip");
    }

    if (!isBuyNow) {
      document.querySelector(".gittu-banner-card").classList.remove("flip");
    }
  }, [isBuyNow]);

  // Enhanced buy token function that uses the presale context
  const buyToken = async (onSuccess) => {
    try {
      // Check if amount is valid
      if (!amount || Number(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      // Check minimum transaction amount (USD value)
      if (Number(valueUsd) < 10) {
        throw new Error('Minimum transaction amount is $10');
      }
      
      // Debug: Log all values before transaction
      console.log('=== TRANSACTION DEBUG ===');
      console.log('Amount entered:', amount);
      console.log('ValueUsd calculated:', valueUsd);
      console.log('Selected token:', selected);
      console.log('PriceUsd:', priceUsd);
      console.log('ChainId passed to hook:', chainId);
      console.log('========================');
      
      // Execute the transaction with the amount and current chainId
      const result = await presaleBuyToken(amount, chainId);
      console.log('Transaction successful:', result);
      
      // Reset form on success
      setAmount('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return {
    stageEnd,
    selected,
    amount,
    prices,
    isBuyNow,
    setSelected,
    setAmount,
    setPrices,
    setIsBuyNow,
    getAmount,
    bonusAmount,
    buyNowHandle,
    priceUsd,
    valueUsd,
    buyToken, // New transactional function
    userBalance,
    setUserBalance,
    // Presale context values
    selectedChainId,
    selectedPayAssetKey,
    quoteUsd,
    quoteStayx,
  };
};

export default useCardHook;
