import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { coins } from "../../helpers";

export default function CoinDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative sm:w-43 lg:w-50">
      {/* Selected item */}
      <button
        // className="w-full flex items-center justify-between font-semibold border-[#ffffff1a]  text-white p-4 border rounded-[10px] hover:bg-gray-700 transition text-lg bg-[#ffffff0d]"
        className="w-full flex items-center justify-between text-base lg:text-lg bg-white/10 backdrop-blur-sm  hover:bg-white/20  border border-white/20 text-white px-4 py-3.5 rounded-xl shadow-sm  transition font-semibold"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <img src={value?.icon} alt={value?.name} className="w-6 h-6" />
          <span className="font-medium">{value?.name}</span>
        </div>
        <FaChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-2 w-full min-w-[220px] rounded-xl shadow-lg overflow-hidden z-10 bg-[#0e2a4c] border border-blue-500/30">
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              onClick={() => {
                onChange(coin);
                setOpen(false);
              }}
              className="flex items-center  gap-3 px-4 py-3 cursor-pointer 
                   hover:bg-gray-600 transition-colors group"
            >
              {/* Coin icon */}
              <img
                src={coin.icon}
                alt={coin.name}
                className="w-6 h-6 rounded-full shadow-sm"
              />

              {/* Coin name + symbol */}
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm ">
                  {coin.name}
                </span>
                <span className="text-gray-400 text-xs">{coin.symbol}</span>
              </div>

              {/* Chain badge */}

              <span
                className="ml-auto text-xs font-medium px-2 py-1 rounded-full  capitalize
                       bg-gray-900 text-gray-300 border border-gray-600
                       group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500"
              >
                {coin.chainId === 1
                  ? "ETH"
                  : coin.chainId === 56
                  ? "BSC"
                  : coin.chainId === 137
                  ? "POLYGON"
                  : coin.chainId === 43114
                  ? "AVAX"
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
