import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const coins = [
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    icon: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    icon: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
  },
];

export default function CoinDropdown() {
  const [selected, setSelected] = useState(coins[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-50">
      {/* Selected item */}
      <button
        className="w-full flex items-center justify-between font-semibold border-[#ffffff1a]  text-white p-4 border rounded-[10px] hover:bg-gray-700 transition text-lg bg-[#ffffff0d]"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <img src={selected.icon} alt={selected.name} className="w-6 h-6" />
          <span className="font-medium">{selected.name}</span>
        </div>
        <FaChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-2 w-full bg-gray-700 rounded-xl shadow-lg overflow-hidden z-10">
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              onClick={() => {
                setSelected(coin);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-600 transition"
            >
              <img src={coin.icon} alt={coin.name} className="w-6 h-6" />
              <span className="text-white font-medium">{coin.name}</span>
              <span className="text-gray-400 text-sm">({coin.symbol})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
