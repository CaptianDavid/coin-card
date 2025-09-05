import { useEffect, useState } from "react";
import CardComponent from "./components/Card/CardComponent";

function App() {
  const [parentConfig, setParentConfig] = useState({
    theme: "dark",
    chainId: 1,
    assetKey: "USDC",
    amount: ""
  });
  const [isReady, setIsReady] = useState(false);

  // Listen for messages from parent
  useEffect(() => {
    const handleMessage = (event) => {
      // Only accept messages from the expected origin
      if (event.origin !== window.location.origin && 
          !event.origin.includes('localhost') && 
          !event.origin.includes('vercel.app')) {
        return;
      }

      const { type, payload } = event.data || {};
      
      switch (type) {
        case "STAYX_PARENT_STATE":
          setParentConfig(payload);
          break;
        case "STAYX_TX_STATUS_UPDATE":
          // Handle transaction status updates from parent
          if (window.cardComponentRef?.handleTransactionUpdate) {
            window.cardComponentRef.handleTransactionUpdate(payload.status, payload.data);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Send ready signal to parent
    const sendReady = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: "STAYX_CARD_READY",
          payload: {}
        }, "*");
        setIsReady(true);
      }
    };

    // Send ready immediately if already in iframe
    sendReady();
    
    // Also send ready after a short delay to ensure parent is listening
    const timeout = setTimeout(sendReady, 100);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, []);

  // Broadcast events to parent
  const broadcastEvent = (type, payload = {}) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type, payload }, "*");
    }
  };

  return (
    <>
      <CardComponent 
        parentConfig={parentConfig}
        isReady={isReady}
        onQuoteUpdate={(quote) => broadcastEvent("STAYX_QUOTE_UPDATED", quote)}
        onTxStart={(txData) => broadcastEvent("STAYX_TX_STARTED", txData)}
        onTxConfirm={(txData) => broadcastEvent("STAYX_TX_CONFIRMED", txData)}
        onTxFail={(error) => broadcastEvent("STAYX_TX_FAILED", error)}
        onError={(error) => broadcastEvent("STAYX_ERROR", error)}
      />
    </>
  );
}

export default App;
