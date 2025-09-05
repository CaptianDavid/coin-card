// export default function CoinList({ coins }) {
//   return (
//     <div
//       style={{
//         margin: "30px 0",
//         display: "flex",
//         justifyContent: "center",
//         gap: "20px",
//         flexWrap: "wrap",
//       }}
//     >
//       {coins.map((coin) => (
//         <div
//           key={coin.symbol}
//           style={{
//             width: "90px",
//             background: "rgba(255, 255, 255, 0.05)",
//             borderRadius: "16px",
//             padding: "8px 4px",

//             textAlign: "center",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
//             transition: "transform 0.2s ease, box-shadow 0.2s ease",
//             cursor: "default",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = "translateY(-5px)";
//             e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.4)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "translateY(0)";
//             e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
//           }}
//         >
//           <div
//             style={{
//               width: "50px",
//               height: "50px",
//               borderRadius: "50%",
//               background: "white",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 4px",
//             }}
//           >
//             <img
//               src={coin.icon}
//               alt={coin.name}
//               style={{ width: "32px", height: "32px" }}
//             />
//           </div>
//           <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
//             {coin.symbol}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

export default function CoinList({ coins }) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-5 mb-8">
      {coins.map((coin) => (
        <div
          key={coin.symbol}
          className="w-24 rounded-2xl bg-white/5 p-2 text-center shadow-md
                     transition-transform duration-200 hover:-translate-y-1
                     hover:shadow-lg"
        >
          <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <img
              src={coin.icon}
              alt={coin.name}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="text-sm font-semibold text-white">{coin.symbol}</div>
        </div>
      ))}
    </div>
  );
}
