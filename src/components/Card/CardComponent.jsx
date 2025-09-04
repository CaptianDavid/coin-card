import { FiArrowDownRight } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi2";
import PresaleLiveTextIcon from "../../assets/icons/presale-live-text.svg";

import Abstrac1 from "../../assets/abstrac-1.png";
import Abstrac2 from "../../assets/abstrac-2.png";
import BannerWrapper from "./Banner.style";
import Countdown from "../countdown/CountDown";
import Progressbar from "../progessbar/Progessbar";
import { useEffect, useState } from "react";
import Button from "../button/Button";
import TokenInfo from "../token/TokenInfo";
import CoinList from "../CoinList";
import SelectDropdown from "../select/SelectDropdown";
import CopyIframeButton from "../CopyIframeButton";

const CardComponent = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [currentBonus, setCurrentBonus] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(40);
  const [raisedToken, setRaisedToken] = useState(0);
  const [goalToken, setGoalToken] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentUsd, setPaymentUsd] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [presaleStatus, setPresaleStatus] = useState("");
  const [stageEnd, setStageEnd] = useState(1759284000);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isBuyNow, setIsBuyNow] = useState(false);

  const handlePaymentInput = (e) => {
    setPaymentAmount(e.target.value);
  };

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
  return (
    // <div className="flex flex-col items-center justify-center bg-black min-h-screen ">

    <BannerWrapper>
      <div className="container2 flex flex-col items-center justify-center min-h-screen ">
        <div className="gittu-banner-right rounded-2xl py-14 pt-16 relative  ">
          <div className="overlay">
            <a href="#" className="presale-live-btn">
              <img src={PresaleLiveTextIcon} alt="Presale live" />
              <span className="icon">
                <FiArrowDownRight />
              </span>
            </a>
          </div>
          <div className="gittu-banner-card ">
            <div className="gittu-banner-card-inner">
              <div className="bg-shape">
                <div className="bg-shape-img img-1">
                  <img src={Abstrac1} alt="shape" />
                </div>
                <div className="bg-shape-img img-2">
                  <img src={Abstrac2} alt="shape" />
                </div>
              </div>

              {isBuyNow ? (
                <div className="card-content">
                  <button className="presale-back-btn" onClick={buyNowHandle}>
                    <HiArrowLeft />
                  </button>

                  <div className="presale-item start mb-5">
                    <div className="presale-item-inner">
                      <h5 className="font-semibold uppercase text-white">
                        {/* Balance: {userBalance} */}
                        Balance: 0
                      </h5>
                    </div>
                    <div className="presale-item-inner">
                      <h5 className="font-semibold uppercase text-white">
                        {/* Balance: {userTokenBalance.toLocaleString("en-US")}{" "}
                        {tokenSymbol} */}
                        Balance : 0 StayX
                      </h5>
                    </div>
                  </div>

                  <div className="presale-item mb-7">
                    <div className="presale-item-inner">
                      <h6>Select Token</h6>
                      <SelectDropdown />
                    </div>
                    <div className="presale-item-inner">
                      <h6>Amount</h6>

                      <input
                        type="number"
                        // min={currentPrice}
                        // step={currentPrice}
                        placeholder="0.5"
                        // value={paymentAmount}
                        // onChange={handlePaymentInput}
                      />
                    </div>
                  </div>

                  <div className="presale-item mb-10">
                    <div className="presale-item-inner">
                      <h6>$ Amount</h6>

                      <input
                        type="text"
                        placeholder="0"
                        // value={paymentUsd}
                        disabled
                      />
                    </div>
                    <div className="presale-item-inner">
                      {/* <h6>Get Amount ( {tokenSymbol} )</h6> */}
                      <h6>Get Amount </h6>
                      <input
                        type="text"
                        placeholder="0"
                        value={buyAmount}
                        disabled
                      />
                    </div>
                  </div>

                  <ul className="token-info-list mb-30">
                    <li>
                      <p>Bonus</p>
                      {/* <p>{currentBonus}%</p> */}
                      <p>5%</p>
                    </li>
                    <li>
                      <p>Total Amount</p>
                      <p>
                        {/* {buyAmount} + {bonusAmount} Bonus */}0 + 0 Bonus
                      </p>
                    </li>
                  </ul>

                  <div className="presale-item-msg">
                    {presaleStatus && (
                      <div className="presale-item-msg__content">
                        <img src={StatusIcon} alt="icon" />
                        <p>{presaleStatus}</p>
                      </div>
                    )}
                  </div>
                  {/* onClick={buyToken} */}
                  <Button size="large">Buy Now</Button>
                </div>
              ) : (
                <div className="card-content">
                  <p className="presale-stage-title uppercase">
                    {/* Stage {currentStage}: {currentBonus}% Bonus! */}
                    Stage
                  </p>
                  <h5 className="font-semibold text-white uppercase">
                    Total Pre-Sale Funding: $1,500,000
                  </h5>

                  <div className="mt-1 mb-5">
                    <Countdown endDate={stageEnd} />
                  </div>

                  <div className="mb-5">
                    <Progressbar done={tokenPercent} />
                  </div>

                  <div className="presale-raised font-medium mb-7">
                    <p className="text-[15px] text-white">
                      {/* Raised: {raisedToken.toLocaleString("en-US")} */}
                      Raised: 1,042,812
                    </p>
                    <p className="text-[15px] text-white">
                      {/* Goal: {goalToken.toLocaleString("en-US")} */}
                      Goal: 200,000,000
                    </p>
                  </div>

                  <div className="mb-8">
                    <TokenInfo />
                  </div>

                  <CoinList />

                  <Button size="large" onClick={buyNowHandle}>
                    {/* Buy {tokenSymbol} now */}
                    BUY $STAYX TODAY
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CopyIframeButton />
    </BannerWrapper>
    // </div>
  );
};

export default CardComponent;
