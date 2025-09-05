import { useEffect, useState } from "react";
import { coins } from "../../helpers";


const BONUS_PERCENT = 10;
const STAYX_PRESALE_PRICE = 0.001;
const STABLECOINS = ["USDT", "USDC", "BUSD"];

const useCardHook = () => {
  
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

  const priceUsd = STABLECOINS.includes(selected.symbol)
    ? 1
    : prices[selected.id]?.usd || 0;
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
  };
};

export default useCardHook;
