import { ConnectButton } from "@rainbow-me/rainbowkit";
import ButtonWrapper from "./button/Button.style";

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
              <ButtonWrapper onClick={openConnectModal} size={size} {...props}>
                Connect Wallet
              </ButtonWrapper>
            ) : chain.unsupported ? (
              <ButtonWrapper
                onClick={openChainModal}
                size={size}
                style={{
                  background:
                    "linear-gradient(90deg, #ff6b6b 0%, #ff8e8e 100%)",
                  color: "#0e1117",
                }}
                {...props}
              >
                Wrong Network
              </ButtonWrapper>
            ) : (
              <ButtonWrapper
                onClick={openAccountModal}
                size={size}
                style={{
                  background:
                    "linear-gradient(90deg, #1dff96 0%, #bcff7b 100%)",
                  color: "#0e1117",
                }}
                {...props}
              >
                {account.displayName}
                {account.displayBalance ? ` (${account.displayBalance})` : ""}
              </ButtonWrapper>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
