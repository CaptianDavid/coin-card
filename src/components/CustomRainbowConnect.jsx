import { ConnectButton } from "@rainbow-me/rainbowkit";
import ButtonWrapper from "./button/Button.style";
import { PiWallet } from "react-icons/pi";

export function CustomConnectButton({ size = "large", ...props }) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div>
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="btn active:scale-95"
              >
                <PiWallet className="size-6 sm:size-7 " />
                <span className="absolute left-1/2 transform -translate-x-1/2">
                  Connect Wallet
                </span>
              </button>
            ) : chain.unsupported ? (
              // <ButtonWrapper
              //   onClick={openChainModal}
              //   size={size}
              //   style={{
              //     background:
              //       "linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%)",
              //     color: "#0e1117",
              //   }}
              //   {...props}
              // >
              //   Wrong Network
              // </ButtonWrapper>
              <button onClick={openChainModal} className="btn">
                <div className="flex items-center justify-center w-full">
                  Wrong Network
                </div>
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                className="btn "
              >
                <div className="flex items-center justify-center w-full">
                  {account.displayName}
                  {account.displayBalance ? ` (${account.displayBalance})` : ""}
                </div>
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
