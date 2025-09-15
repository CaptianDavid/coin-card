import { useState, useEffect } from "react";
import { FiArrowDownRight } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import PresaleLiveTextIcon from "../../assets/icons/presale-live-text.svg";
import CoinStack from "../../assets/icons/coinStack.png";
import ArrowRight from "../../assets/icons/arrow-right.png";

import BannerWrapper from "./Banner.style";
import Countdown from "../countdown/CountDown";
import Progressbar from "../progessbar/Progessbar";
import { toast } from "react-toastify";

import Button from "../button/Button";
import TokenInfo from "../token/TokenInfo";
import CoinList from "../CoinList";
import SelectDropdown from "../select/SelectDropdown";
import CopyIframeButton from "../CopyIframeButton";
import { coins } from "../../helpers";
import useCardHook from "./useCardHook";
import {
  useAccount,
  useConnect,
  useChainId,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import ConnectButton from "../ConnectButton";

const errorPatterns = [
  {
    pattern: /user rejected/i,
    message: "Transaction was cancelled by user",
  },
  {
    pattern: /insufficient funds/i,
    message: "Insufficient balance for this transaction",
  },
  {
    pattern: /gas required exceeds allowance/i,
    message: "Transaction requires more gas. Try increasing gas limit.",
  },
  {
    pattern: /network error/i,
    message: "Network connection error. Please check your internet connection.",
  },
  {
    pattern: /invalid BigNumberish/i,
    message: "Invalid amount format. Please enter a valid number.",
  },
  {
    pattern: /execution reverted/i,
    message: "Transaction failed. The contract rejected the transaction.",
  },
  {
    pattern: /nonce too low/i,
    message: "Transaction nonce error. Please try again.",
  },
  {
    pattern: /already known/i,
    message: "Transaction already submitted. Please wait for confirmation.",
  },
  {
    pattern: /replacement transaction underpriced/i,
    message: "Transaction fee too low. Please try again.",
  },
  {
    pattern: /intrinsic gas too low/i,
    message: "Gas limit too low. Please try again.",
  },
  {
    pattern: /allowance/i,
    message: "Token approval required. Please approve the transaction first.",
  },
  {
    pattern: /enter amount/i,
    message: "Please enter a valid amount",
  },
  {
    pattern: /no provider/i,
    message: "Wallet not connected. Please connect your wallet first.",
  },
  {
    pattern: /unsupported chain/i,
    message:
      "Unsupported blockchain network. Please switch to a supported network.",
  },
  {
    pattern: /contract not deployed/i,
    message: "Smart contract not found. Please check the network.",
  },
  {
    pattern: /missing revert data/i,
    message:
      "Transaction failed. The contract rejected the transaction or insufficient gas.",
  },
  {
    pattern: /call_exception/i,
    message:
      "Contract call failed. Please check your token balance and try again.",
  },
];

const CardComponent = () => {
  const { isConnected, address, chain, chainId: chain_id } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();

  // Check if we're on mobile (must be declared first)
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

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
    buyToken,
    userBalance,
    setUserBalance,
  } = useCardHook(chainId);
  const requiredChainId = selected?.chainId;
  const needsNetworkSwitch = address && chainId !== requiredChainId;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Function to parse and format error messages
  const parseError = (error) => {
    const errorMessage = error?.message || error?.toString() || "Unknown error";

    // Find matching pattern
    for (const pattern of errorPatterns) {
      if (pattern.pattern.test(errorMessage)) {
        return pattern.message;
      }
    }

    // If no pattern matches, return a truncated version of the original error
    if (errorMessage.length > 100) {
      return errorMessage.substring(0, 100) + "...";
    }

    return errorMessage;
  };

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleBuyToken = async () => {
    try {
      setError(""); // Clear any previous errors
      setSuccess(""); // Clear any previous success messages
      setIsLoading(true);
      if (!address) return toast.info("Please connect your wallet");

      // Check if we need to switch networks - show button instead of auto-switching
      if (needsNetworkSwitch) {
        setError(
          `Please switch to ${selected.symbol} network first using the button below.`
        );
        return;
      }

      // Only proceed with transaction if wallet is connected and on correct network

      if (!amount || Number(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      // Execute the transaction with success callback
      const result = await buyToken((txResult) => {
        setSuccess(
          "🎉 Transaction successful! Your STAYX tokens have been purchased and added to your wallet."
        );
      });
      console.log("result trx", result);
    } catch (error) {
      console.error("Error in buy token flow:", error);
      setError(parseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError("");
    setSuccess("");
  };

  // Handle network switching with clear UX
  const handleSwitchNetwork = async () => {
    try {
      setIsSwitchingNetwork(true);
      setError("");
      setSuccess("");

      console.log(
        `Switching to ${selected.symbol} network (Chain ID: ${requiredChainId})`
      );
      await switchChainAsync({ chainId: requiredChainId });

      if (chain_id === requiredChainId) {
        setSuccess(
          `✅ Successfully switched to ${selected.symbol} network! You can now proceed with your purchase.`
        );
      }
    } catch (switchError) {
      console.error("Failed to switch network:", switchError);
      setError(
        `Failed to switch network. Please switch to ${selected.symbol} network manually in your wallet.`
      );
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  // Force refresh mobile connection state

  return (
    <BannerWrapper>
      <div className="flex items-center justify-center mx-auto px-3 pb-6 pt-20">
        <div className="gittu-banner-right rounded-[18px] relative pb-7 sm:pb-4">
          <div className="overlay">
            <a href="https://stayx.net/" className="presale-live-btn">
              <img src={PresaleLiveTextIcon} alt="Presale live" />
              <span className="icon ">
                <FiArrowDownRight />
              </span>
            </a>
          </div>
          {/* Wallet Address & Disconnect - Outside flip area */}
          {address && (
            <div className="wallet-info absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="text-white/70 text-xs">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              {/* {isMobile && (
                <button
                  onClick={refreshMobileConnection}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  title="Refresh Connection"
                >
                  ↻
                </button>
              )} */}
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                title="Disconnect Wallet"
              >
                <MdLogout size={12} />
                Disconnect Wallet
              </button>
            </div>
          )}

          <div className="gittu-banner-card ">
            <div className="gittu-banner-card-inner">
              {/* <div className="bg-shape">
                <div className="bg-shape-img img-1">
                  <img src={Abstrac1} alt="shape" />
                </div>
                <div className="bg-shape-img img-2">
                  <img src={Abstrac2} alt="shape" />
                </div>
              </div> */}

              {isBuyNow ? (
                <div className="card-content">
                  <button
                    className="presale-back-btn cursor-pointer"
                    onClick={buyNowHandle}
                  >
                    <HiArrowLeft />
                  </button>

                  <div className="mb-7 !text-center flex items-center justify-center">
                    <h2 className="!text-xl text-white !font-[400]  text-center uppercase">
                      LOCK YOUR STAYX at PRESALE PRICING
                    </h2>
                  </div>

                  <div className="presale-item max-[602px]:mb-4 mb-6">
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
                        disabled={isLoading}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        step="0.01"
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
                      <p className="max-[310px]:max-w-[8rem]">
                        Limited Time Early Access
                      </p>

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

                  {/* Network Switch Button */}
                  {needsNetworkSwitch &&
                    !error?.includes("manually in your wallet") && (
                      <div className="mb-4 p-4 rounded-lg bg-orange-500/20 border border-orange-500/30 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/30 flex items-center justify-center">
                            <span className="text-orange-400 text-xs">!</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-orange-400 text-sm font-medium">
                              Network Switch Required
                            </p>
                            <p className="text-orange-300 text-xs mt-1">
                              Switch to {selected.symbol} network to continue
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleSwitchNetwork}
                          size="large"
                          disabled={isSwitchingNetwork}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                        >
                          {isSwitchingNetwork ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Switching Network...
                            </div>
                          ) : (
                            `Switch to ${selected.symbol} Network`
                          )}
                        </Button>
                      </div>
                    )}

                  {/* Error Display */}
                  {error && (
                    <div className="error-message mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center mt-0.5">
                          <span className="text-red-400 text-xs">!</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-red-400 text-sm font-medium mb-1">
                            Transaction Failed
                          </p>
                          <p className="text-red-300 text-sm leading-relaxed">
                            {error}
                          </p>
                        </div>
                        <button
                          onClick={() => setError("")}
                          className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <span className="text-lg">&times;</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Success Display */}
                  {success && (
                    <div className="success-message mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center mt-0.5">
                          <span className="text-green-400 text-xs">✓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-green-400 text-sm font-medium mb-1">
                            Success!
                          </p>
                          <p className="text-green-300 text-sm leading-relaxed">
                            {success}
                          </p>
                        </div>
                        <button
                          onClick={() => setSuccess("")}
                          className="flex-shrink-0 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <span className="text-lg">&times;</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Loading Display */}
                  {isLoading && (
                    <div className="loading-message mb-4 p-4 rounded-lg bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-400 text-sm font-medium">
                            Processing Transaction...
                          </p>
                          <p className="text-blue-300 text-xs">
                            Please wait while we process your request
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {address ? (
                    <button
                      onClick={handleBuyToken}
                      disabled={isLoading || needsNetworkSwitch}
                      className={`btn disabled:opacity-50 disabled:cursor-not-allowed ${
                        needsNetworkSwitch && "hidden"
                      } `}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-5 w-full">
                          {/* Spinner */}
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></div>
                          {/* Text */}
                          <span>
                            Processing{" "}
                            <span className="hidden sm:inline">
                              Transaction
                            </span>
                            ...
                          </span>
                        </div>
                      ) : (
                        <>
                          <img
                            src={CoinStack}
                            alt="coin-stack"
                            className="size-6 md:size-7 text-white icon-white "
                          />
                          <span class="absolute left-1/2 transform -translate-x-1/2">
                            Claim Your STAYX
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <ConnectButton />
                  )}
                </div>
              ) : (
                <div className="card-content">
                  <div className="flex flex-col items-center justify-center mb-3 mt-3">
                    <h1 className="!text-2xl sm:!text-4xl font-semibold text-white !mb-2">
                      $1,250,000
                    </h1>
                    <h5 className="!text-xl text-white !font-[400] uppercase text-center ">
                      Launchpad Phase 1 — Opening Price
                    </h5>
                  </div>

                  <div className="mt-1 mb-5 flex items-center justify-center">
                    <Countdown endDate={stageEnd} />
                  </div>

                  {/* progess bar: you can uncomment this if you want to show the progress bar */}

                  {/* <div className="mb-5">
                    <Progressbar done={tokenPercent} />
                  </div> */}

                  <div className="mb-8">
                    <TokenInfo />
                  </div>

                  <CoinList coins={coins} selected={selected} />

                  {address ? (
                    <button onClick={buyNowHandle} className="btn">
                      <img
                        src={ArrowRight}
                        alt="arrow-right"
                        className="size-6 md:size-7 text-white icon-white "
                      />
                      <span class="absolute left-1/2 transform -translate-x-1/2">
                        Continue
                      </span>
                    </button>
                  ) : (
                    <ConnectButton />
                  )}
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
