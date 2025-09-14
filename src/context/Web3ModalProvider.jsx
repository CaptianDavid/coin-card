import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { useState } from "react";
import { projectId, metadata, networks, wagmiAdapter } from '../config'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#000000",
  },
};

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  
  features: {
    analytics: false,
    socials:false,
    email:false,
    onramp: false,
  
  
  },
});

const Web3ModalProvider = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3ModalProvider;
