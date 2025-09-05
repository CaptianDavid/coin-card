import { memo } from "react";

const CoinList = ({ coins }) => {
  // Duplicate coins array for infinite scroll illusion
  const coinsLoop = [...coins, ...coins];

  return (
    <div className="mt-6 mb-8 overflow-x-auto scrollbar-hide scroll-container">
      <div className="flex gap-3  scroll-track">
        {coinsLoop.map((coin, idx) => (
          <div
            key={idx}
            // onClick={() => setSelected(coin)}
            title={coin.name}
            className={`w-20 rounded-2xl p-2 text-center shadow-md bg-white/5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}
          >
            <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <img
                src={coin.icon}
                alt={coin.name}
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="text-sm font-semibold text-white">
              {coin.symbol}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(CoinList);
