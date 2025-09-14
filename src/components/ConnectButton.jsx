import { useAppKit } from "@reown/appkit/react";

import { useAccount } from "wagmi";
import { PiWallet } from "react-icons/pi";

export default function ConnectButton({ size = "large", ...props }) {
  const { open } = useAppKit();
  const { address } = useAccount();

  const connectWallet = () => {
    open();
  };

  const connected = Boolean(address);

  return (
    <button onClick={connectWallet} className="btn active:scale-95">
      {connected ? (
        address?.slice(0, 5) + "..." + address?.slice(-5)
      ) : (
        <>
          <PiWallet className="size-6 sm:size-7 " />
          <span class="absolute left-1/2 transform -translate-x-1/2">
            Connect Wallet
          </span>
        </>
      )}
    </button>
  );
}
