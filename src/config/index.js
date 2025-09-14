import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, bsc, polygon, avalanche } from "@reown/appkit/networks";

export const projectId = "27662a48630e414748d213813262a714";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "StayX Presale",
  description: "StayX – Freedom to Travel",
  url: "https://my.stayx.net", // origin must match your domain & subdomain
  // url : 'http://localhost:5173/',
  icons: ["https://my.stayx.net/logotr.png"],
};

export const networks = [mainnet, bsc, polygon, avalanche];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
