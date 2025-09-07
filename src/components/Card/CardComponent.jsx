import { FiArrowDownRight } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi2";
import PresaleLiveTextIcon from "../../assets/icons/presale-live-text.svg";

import Abstrac1 from "../../assets/abstrac-1.png";
import Abstrac2 from "../../assets/abstrac-2.png";
import BannerWrapper from "./Banner.style";
import Countdown from "../countdown/CountDown";
import Progressbar from "../progessbar/Progessbar";

import Button from "../button/Button";
import TokenInfo from "../token/TokenInfo";
import CoinList from "../CoinList";
import SelectDropdown from "../select/SelectDropdown";
import CopyIframeButton from "../CopyIframeButton";
import { coins } from "../../helpers";
import useCardHook from "./useCardHook";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const CardComponent = () => {
  const { openConnectModal } = useConnectModal();
  const {
    stageEnd,
    selected,
    amount,
    isBuyNow,
    setSelected,
    setAmount,
    getAmount,
    bonusAmount,

    buyNowHandle,
    valueUsd,
  } = useCardHook();

  const buyToken = () => {
    if (!openConnectModal) {
      console.error("Connect modal not available");
      return;
    }
    openConnectModal(); // this opens the wallet modal
  };
  return (
    <BannerWrapper>
      <div className="container2 flex flex-col items-center justify-center min-h-screen mx-auto">
        <div className="gittu-banner-right rounded-2xl py-14 pt-16 relative  ">
          <div className="overlay">
            <a href="https://stayx.net/" className="presale-live-btn">
              <img src={PresaleLiveTextIcon} alt="Presale live" />
              <span className="icon ">
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
                  <button
                    className="presale-back-btn cursor-pointer"
                    onClick={buyNowHandle}
                  >
                    <HiArrowLeft />
                  </button>

                  {/* <div className="presale-item start mb-5 flex flex-col">
                    <div>
                      <h2 className="!text-xl">LOCK YOUR STAYX at PRESALE PRICING</h2>
                    </div>
                    <div className="presale-item-inner">
                      <h5 className="font-semibold uppercase text-white">
                        Balance: {userBalance}
                        Balance: 0
                      </h5>
                    </div>
                    <div className="presale-item-inner">
                      <h5 className="font-semibold uppercase text-white">
                        Balance: {userTokenBalance.toLocaleString("en-US")}{" "}
                        {tokenSymbol}
                        Balance : 0 StayX
                      </h5>
                    </div>
                  </div> */}
                  <div className="mb-7 !text-center flex items-center justify-center">
                    <h2 className="!text-xl text-white !font-[400]  text-center uppercase">
                      LOCK YOUR STAYX at PRESALE PRICING
                    </h2>
                  </div>

                  <div className="presale-item mb-4">
                    <div className="presale-item-inner">
                      <h6>Select Token</h6>
                      <SelectDropdown
                        value={selected}
                        onChange={(coin) => setSelected(coin)}
                      />
                    </div>
                    <div className="presale-item-inner">
                      <h6>Amount</h6>

                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="presale-item mb-11">
                    <div className="presale-item-inner">
                      <h6>$ Amount</h6>

                      <input
                        type="text"
                        placeholder="0"
                        value={valueUsd ? valueUsd.toFixed(2) : ""}
                        disabled
                      />
                    </div>
                    <div className="presale-item-inner">
                      <h6>Get Amount ($STAYX) </h6>
                      <input
                        type="text"
                        placeholder="0"
                        value={getAmount ? getAmount.toFixed(0) : ""}
                        disabled
                      />
                    </div>
                  </div>

                  {/* <div className="my-4 mb-6 !text-sm sm:!text-base text-white/90">
                    <h4></h4>
                  </div> */}

                  <ul className="token-info-list mb-30">
                    <li>
                      <p className="max-[310px]:max-w-[8rem]">Limited: Launch Bonus</p>

                      <p>10%</p>
                    </li>
                    <li className="text-white ">
                      <p className="">Total Amount ($STAYX)</p>
                      <p className="!text-right">
                        {getAmount ? getAmount.toFixed(0) : "0"} +{" "}
                        {bonusAmount ? bonusAmount.toFixed(0) : "0"} Bonus
                      </p>
                    </li>
                  </ul>

                  {/* <div className="presale-item-msg">
                    {presaleStatus && (
                      <div className="presale-item-msg__content">
                        <img src={StatusIcon} alt="icon" />
                        <p>{presaleStatus}</p>
                      </div>
                    )}
                  </div> */}

                  <Button onClick={buyToken} size="large">
                    Buy Now
                  </Button>
                </div>
              ) : (
                <div className="card-content">
                  <div className="flex flex-col items-center justify-center mb-3">
                    <h1 className="!text-2xl sm:!text-4xl font-semibold text-white !mb-2">
                      $1,250,000
                    </h1>
                    <h5 className="!text-xl text-white !font-[400] uppercase ">
                      Pre-Sale Funding
                    </h5>
                  </div>

                  <div className="mt-1 mb-5 flex items-center justify-center">
                    <Countdown endDate={stageEnd} />
                  </div>

                  {/* progess bar: you can uncomment this if you want to show the progress bar */}

                  {/* <div className="mb-5">
                    <Progressbar done={tokenPercent} />
                  </div> */}

                  {/* <div className="presale-raised font-medium mb-7">
                    <p className="text-[15px] text-white">
                      Raised: {raisedToken.toLocaleString("en-US")}
                      Raised: 1,042,812
                    </p>
                    <p className="text-[15px] text-white">
                      Goal: {goalToken.toLocaleString("en-US")}
                      Goal: 200,000,000
                    </p>
                  </div> */}

                  <div className="mb-8">
                    <TokenInfo />
                  </div>

                  <CoinList coins={coins} selected={selected} />

                  <button
                    onClick={buyNowHandle}
                    className="
    w-full
    bg-[#1EE8B7]
    text-[#0e1117]
    font-outfit font-bold
    text-[16px] leading-[24px]
    uppercase
    px-8 py-4
    rounded-full
    shadow-lg
    hover:bg-[#19c9a0]
    hover:shadow-xl
    active:scale-95
    transition-all duration-300
    flex items-center justify-center gap-2 cursor-pointer
  "
                  >
                    Buy now
                  </button>
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
