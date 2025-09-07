// src/contracts/tokens.js
export const TOKENS = {
  1: { // Ethereum
    NATIVE: { symbol: "ETH",  kind: "native" },
    USDC:   { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6,  kind: "erc20", usdPrice1e18: "1000000000000000000", accepted: true, permit: true }
  },
  56: { // BNB
    NATIVE: { symbol: "BNB",  kind: "native" },
    USDT:   { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18, kind: "erc20", usdPrice1e18: "1000000000000000000", accepted: true, permit: false }
  },
  137: { // Polygon
    NATIVE: { symbol: "MATIC", kind: "native" }
  },
  43114: { // Avalanche
    NATIVE: { symbol: "AVAX", kind: "native" }
  }
};
