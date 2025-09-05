import { useEffect, useState } from "react";
import { coins } from "../../helpers";


const BONUS_PERCENT = 10;
const STAYX_PRESALE_PRICE = 0.001;
const STABLECOINS = ["USDT", "USDC", "BUSD"];

const useCardHook = (parentConfig = {}, onQuoteUpdate, onTxStart, onTxConfirm, onTxFail, onError) => {
  
  const [stageEnd, setStageEnd] = useState(1759284000);

  const [selected, setSelected] = useState(
    coins.find((c) => c.symbol === "BNB")
  );
  const [amount, setAmount] = useState("");
  const [prices, setPrices] = useState({});
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  // Handle parent configuration updates
  useEffect(() => {
    if (parentConfig.assetKey) {
      const parentCoin = coins.find((c) => c.symbol === parentConfig.assetKey);
      if (parentCoin) {
        setSelected(parentCoin);
      }
    }
    if (parentConfig.amount) {
      setAmount(parentConfig.amount);
    }
  }, [parentConfig]);

  useEffect(() => {
    const ids = coins.map((t) => t.id).join(",");
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    )
      .then((res) => res.json())
      .then(setPrices)
      .catch(console.error);
  }, []);

  const priceUsd = STABLECOINS.includes(selected.symbol)
    ? 1
    : prices[selected.id]?.usd || 0;
  const valueUsd = amount ? amount * priceUsd : ""; // ✅ empty if no input

  const getAmount = valueUsd ? valueUsd / STAYX_PRESALE_PRICE : 0;
  const bonusAmount = getAmount * (BONUS_PERCENT / 100);

  // Broadcast quote updates to parent
  useEffect(() => {
    if (onQuoteUpdate && amount && valueUsd && getAmount) {
      onQuoteUpdate({
        inputAmount: amount,
        inputToken: selected.symbol,
        outputAmount: getAmount + bonusAmount,
        outputToken: "STAYX",
        bonusAmount: bonusAmount,
        bonusPercent: BONUS_PERCENT,
        priceUsd: valueUsd
      });
    }
  }, [amount, valueUsd, getAmount, bonusAmount, selected.symbol, onQuoteUpdate]);

  const buyNowHandle = () => {
    setIsBuyNow(!isBuyNow);
  };

  // Request transaction from parent (parent handles actual execution)
  const requestTransaction = () => {
    if (!amount || !selected || isTransactionPending) return;

    setIsTransactionPending(true);
    
    // Send transaction request to parent
    onTxStart?.({
      inputAmount: amount,
      inputToken: selected.symbol,
      outputAmount: getAmount + bonusAmount,
      outputToken: "STAYX",
      chainId: parentConfig.chainId || 1,
      bonusAmount: bonusAmount,
      bonusPercent: BONUS_PERCENT
    });
  };

  // Handle transaction status updates from parent
  const handleTransactionUpdate = (status, data) => {
    switch (status) {
      case 'CONFIRMED':
        setIsTransactionPending(false);
        onTxConfirm?.(data);
        break;
      case 'FAILED':
        setIsTransactionPending(false);
        onTxFail?.(data);
        break;
      case 'PENDING':
        // Keep pending state
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (isBuyNow) {
      document.querySelector(".gittu-banner-card").classList.add("flip");
    }

    if (!isBuyNow) {
      document.querySelector(".gittu-banner-card").classList.remove("flip");
    }
  }, [isBuyNow]);
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
    isTransactionPending,
    buyNowHandle,
    requestTransaction,
    handleTransactionUpdate,
    priceUsd,
    valueUsd,
  };
};

export default useCardHook;
