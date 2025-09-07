import { parseUnits, formatUnits } from "ethers";
import { TOKENS } from "../contracts/tokens";

// Simplified quote function since the contract doesn't have quote functions
// This uses a fixed presale price for calculation
const PRESALE_PRICE = 0.001; // $0.001 per STAYX token

export async function getQuote({ provider, chainId, presaleAddress, assetKey, amountHuman }) {
  if (!provider) throw new Error("No provider");
  if (!presaleAddress) throw new Error("Missing presale address");
  if (!amountHuman || Number(amountHuman) <= 0) throw new Error("Enter amount");

  const cfg = (TOKENS[chainId] || {})[assetKey];
  if (!cfg) throw new Error("Unsupported asset");

  // Calculate USD value based on token type
  let usdValue;
  if (cfg.kind === "native") {
    // For native tokens, we need to get the current price
    // For now, using a simplified calculation
    usdValue = parseUnits(amountHuman, 18); // Assuming 1:1 for simplicity
  } else {
    // For stablecoins, assume 1:1 USD value
    usdValue = parseUnits(amountHuman, cfg.decimals);
  }

  // Calculate STAYX tokens based on presale price
  const presalePriceWei = parseUnits(PRESALE_PRICE.toString(), 18);
  const stayxAmount = (usdValue * BigInt(10**18)) / presalePriceWei;

  return {
    stayxAmount: stayxAmount.toString(),
    usdValue: usdValue.toString(),
    stayxFormatted: formatUnits(stayxAmount, 18),
    usdFormatted: formatUnits(usdValue, 18),
  };
}
