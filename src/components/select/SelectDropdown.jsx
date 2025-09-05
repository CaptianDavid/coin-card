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
        className="w-full flex items-center justify-between text-base lg:text-lg bg-gray-800 text-white px-4 py-3.5 rounded-xl shadow-sm border border-[#ffffff1a] hover:bg-gray-700 transition font-semibold"
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
        <div className="absolute mt-2 w-full bg-gray-700 rounded-xl shadow-lg overflow-hidden z-10">
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              onClick={() => {
                onChange(coin); // ✅ parent updates selected
                setOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-600 transition"
            >
              <img src={coin.icon} alt={coin.name} className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-white font-medium text-sm lg:text-base">{coin.name}</span>
              <span className="text-gray-400 text-sm">({coin.symbol})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
