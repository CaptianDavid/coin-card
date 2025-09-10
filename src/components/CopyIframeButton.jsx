import React, { useEffect, useState } from "react";

const CopyIframeButton = () => {
  const [copied, setCopied] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Detect if the app is inside an iframe
    if (window.self !== window.top) {
      setIsEmbedded(true);
    }
  }, []);

  const iframeCode = `<iframe 
  src="${window.location.origin}" 
  width="680" 
  height="700" 
  style="border:none; border-radius:16px; overflow:hidden;" 
   scrolling="no";
  title="Presale Card">
</iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEmbedded) return null;

  return (
    <div className="flex items-center justify-center max-w-[512px] mx-auto pb-8 px-4">
      <div className="flex flex-col items-center gap-3 w-full ">
        <textarea
          readOnly
          value={iframeCode}
          className="w-full p-3 rounded-xl bg-[#0E1117] text-white text-sm font-mono border border-gray-700"
          rows={6}
        />
        <button
          onClick={handleCopy}
          className="px-5 py-2 cursor-pointer rounded-lg bg-gray-700 border border-gray-300 text-white font-semibold shadow hover:bg-gray-800 transition"
        >
          {copied ? "Copied " : "Copy Iframe"}
        </button>
      </div>
    </div>
  );
};

export default CopyIframeButton;
