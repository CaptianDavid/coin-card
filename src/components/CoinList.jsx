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

export default function CoinList() {
  return (
    <div
      style={{
        margin: "30px 0",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {coins.map((coin) => (
        <div
          key={coin.symbol}
          style={{
            width: "90px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "8px 4px",
            
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 4px",
            }}
          >
            <img
              src={coin.icon}
              alt={coin.name}
              style={{ width: "32px", height: "32px" }}
            />
          </div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
            {coin.name}
          </div>
        </div>
      ))}
    </div>
  );
}
