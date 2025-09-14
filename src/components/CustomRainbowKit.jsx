import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet, bsc, polygon, avalanche } from "wagmi/chains";
import {
  argentWallet,
  coinbaseWallet,
  imTokenWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = "27662a48630e414748d213813262a714";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: "Others",
      wallets: [
        trustWallet,
        ledgerWallet,
        argentWallet,
        omniWallet,
        imTokenWallet,
      ],
    },
  ],
  {
    appName: "StayX Presale",
    projectId: projectId,
  }
);

const config = getDefaultConfig({
  appName: "StayX Presale",
  projectId: projectId,
  chains: [mainnet, bsc, polygon, avalanche],
  connectors,
});
const queryClient = new QueryClient();

const CustomRainbowKit = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={bsc}
          modalSize="compact" //wide,compact
          theme={darkTheme({
            accentColor: "rgba(255, 255, 255, 0.2)",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default CustomRainbowKit;
