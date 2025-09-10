import { useState, useEffect } from "react";
import { FiArrowDownRight } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
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
import {
  useAccount,
  useConnect,
  useChainId,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { ethers } from "ethers";
import { CustomConnectButton } from "../CustomRainbowConnect";

const CardComponent = () => {
  const { isConnected, address, chain, chainId: chain_id } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();

  // Check if we're on mobile (must be declared first)
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // Mobile-specific connection state management
  const [mobileConnectionState, setMobileConnectionState] = useState({
    isConnected: false,
    address: null,
  });

  // Use appropriate connection state based on device
  const effectiveIsConnected = isMobile
    ? mobileConnectionState.isConnected
    : isConnected;
  const effectiveAddress = isMobile ? mobileConnectionState.address : address;

  // Initialize mobile connection state from localStorage
  useEffect(() => {
    if (isMobile) {
      const savedConnection = localStorage.getItem("walletConnected");
      const savedAddress = localStorage.getItem("walletAddress");

      if (savedConnection === "true" && savedAddress) {
        setMobileConnectionState({
          isConnected: true,
          address: savedAddress,
        });
        console.log("Restored mobile connection from localStorage:", {
          address: savedAddress,
        });
      }
    }
  }, [isMobile]);

  // Update mobile connection state when wagmi state changes
  useEffect(() => {
    if (isMobile) {
      console.log("Mobile connection effect triggered:", {
        isConnected,
        address,
      });

      if (isConnected && address) {
        // Wallet connected - update both states
        setMobileConnectionState({
          isConnected: true,
          address: address,
        });
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", address);
        console.log("Mobile wallet connected and saved:", address);
      } else if (!isConnected && !address) {
        // Only clear if we're sure it's disconnected
        const savedConnection = localStorage.getItem("walletConnected");
        if (savedConnection !== "true") {
          setMobileConnectionState({
            isConnected: false,
            address: null,
          });
          localStorage.removeItem("walletConnected");
          localStorage.removeItem("walletAddress");
          console.log("Mobile wallet disconnected and cleared");
        }
      }
    }
  }, [isConnected, address, isMobile]);
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

  // Function to get required chain ID based on selected token
  const getRequiredChainId = (tokenSymbol) => {
    switch (tokenSymbol) {
      case "ETH":
        return 1; // Ethereum
      case "BNB":
        return 56; // BNB Chain
      case "MATIC":
        return 137; // Polygon
      case "AVAX":
        return 43114; // Avalanche
      case "USDT":
        return 56; // BNB Chain (for USDT)
      case "USDC":
        return 1; // Ethereum (for USDC)
      default:
        return 56; // Default to BNB Chain
    }
  };

  // Check if user needs to switch networks
  const requiredChainId = getRequiredChainId(selected?.symbol);
  const needsNetworkSwitch =
    effectiveIsConnected && chainId !== requiredChainId;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Function to parse and format error messages
  const parseError = (error) => {
    const errorMessage = error?.message || error?.toString() || "Unknown error";

    // Common error patterns and their user-friendly messages
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
        message:
          "Network connection error. Please check your internet connection.",
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
        message:
          "Token approval required. Please approve the transaction first.",
      },
      {
        pattern: /enter amount/i,
        message: "Please enter a valid amount",
      },
      {
        pattern: /minimum transaction amount/i,
        message: "Minimum transaction amount is $10",
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
      if (!effectiveIsConnected) {
        // If wallet is not connected, show wallet selection modal
        if (connectors.length > 0) {
          await connect();
          // On mobile, wait a bit for the connection to be established
          if (isMobile) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          // After connecting, just return - don't proceed with transaction
          return;
        } else {
          setError("No wallet connectors available");
          return;
        }
      }

      // Check if we need to switch networks - show button instead of auto-switching
      if (needsNetworkSwitch) {
        setError(
          `Please switch to ${selected.symbol} network first using the button below.`,
        );
        return;
      }

      // Only proceed with transaction if wallet is connected and on correct network
      // Check if amount is entered and meets minimum
      if (!amount || Number(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }
      if (Number(valueUsd) < 10) {
        setError("Minimum transaction amount is $10");
        return;
      }

      // For mobile, refresh connection state and double-check before proceeding
      if (isMobile) {
        refreshMobileConnection();
        if (!effectiveIsConnected) {
          setError("Wallet connection lost. Please reconnect your wallet.");
          return;
        }
      }

      // Execute the transaction with success callback
      const result = await buyToken((txResult) => {
        setSuccess(
          "🎉 Transaction successful! Your STAYX tokens have been purchased and added to your wallet.",
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
    if (isMobile) {
      setMobileConnectionState({
        isConnected: false,
        address: null,
      });
      localStorage.removeItem("walletConnected");
      localStorage.removeItem("walletAddress");
    }
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
        `Switching to ${selected.symbol} network (Chain ID: ${requiredChainId})`,
      );
      await switchChainAsync({ chainId: requiredChainId });

      // On mobile, be more lenient with verification since it often works even if verification fails
      if (isMobile) {
        console.log("Mobile detected - assuming network switch succeeded");
        setSuccess(
          `✅ Network switch initiated! Please check your wallet and return to complete the purchase.`,
        );
      } else {
        // Desktop: Verify the switch worked
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          const currentChainId = Number(network.chainId);

          console.log(
            `Desktop network switch verification: Current: ${currentChainId}, Required: ${requiredChainId}`,
          );

          if (currentChainId === requiredChainId) {
            setSuccess(
              `✅ Successfully switched to ${selected.symbol} network! You can now proceed with your purchase.`,
            );
            console.log(
              `✅ Successfully switched to ${selected.symbol} network!`,
            );
          } else {
            setError(
              `Network switch incomplete. Please try again or switch manually in your wallet.`,
            );
            console.log(
              `❌ Network switch failed. Current: ${currentChainId}, Required: ${requiredChainId}`,
            );
          }
        } catch (verifyError) {
          console.error("Desktop network verification failed:", verifyError);
          setError(
            `Network switch incomplete. Please try again or switch manually in your wallet.`,
          );
        }
      }
    } catch (switchError) {
      console.error("Failed to switch network:", switchError);
      setError(
        `Failed to switch network. Please switch to ${selected.symbol} network manually in your wallet.`,
      );
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  // Manual connection check for mobile
  const checkMobileConnection = async () => {
    if (isMobile && !effectiveIsConnected) {
      try {
        // Try to reconnect
        if (connectors.length > 0) {
          await connect();
        }
      } catch (error) {
        console.error("Failed to reconnect on mobile:", error);
        setError("Failed to connect wallet. Please try again.");
      }
    }
  };

  // Force refresh mobile connection state
  const refreshMobileConnection = () => {
    if (isMobile) {
      const savedConnection = localStorage.getItem("walletConnected");
      const savedAddress = localStorage.getItem("walletAddress");

      console.log("Refreshing mobile connection:", {
        savedConnection,
        savedAddress,
      });

      if (savedConnection === "true" && savedAddress) {
        setMobileConnectionState({
          isConnected: true,
          address: savedAddress,
        });
        console.log("Mobile connection refreshed from localStorage");
      } else {
        setMobileConnectionState({
          isConnected: false,
          address: null,
        });
        console.log("Mobile connection cleared - no saved state");
      }
    }
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
          {/* Wallet Address & Disconnect - Outside flip area */}
          {effectiveIsConnected && effectiveAddress && (
            <div className="wallet-info absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="text-white/70 text-xs">
                {effectiveAddress.slice(0, 6)}...{effectiveAddress.slice(-4)}
              </span>
              {isMobile && (
                <button
                  onClick={refreshMobileConnection}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  title="Refresh Connection"
                >
                  ↻
                </button>
              )}
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
                        Limited: Launch Bonus
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

                  {/* <div className="presale-item-msg">
                    {presaleStatus && (
                      <div className="presale-item-msg__content">
                        <img src={StatusIcon} alt="icon" />
                        <p>{presaleStatus}</p>
                      </div>
                    )}
                  </div> */}

                  <Button
                    onClick={handleBuyToken}
                    size="large"
                    disabled={isLoading || needsNetworkSwitch}
                    className={
                      isLoading || needsNetworkSwitch
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Transaction...
                      </div>
                    ) : needsNetworkSwitch ? (
                      "Switch Network First"
                    ) : (
                      "Buy Now"
                    )}
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

                  {effectiveIsConnected ? (
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
                  ) : (
                    <CustomConnectButton size="large" />
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
