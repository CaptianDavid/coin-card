import TokenInfoWrapper from "./TokenInfo.style";

const TokenInfo = ({ variant }) => {
  return (
    <TokenInfoWrapper variant={variant}>
      {/* <li>
        <p>Token Name</p>
        <h6>StayX</h6>
      </li> */}
      <li>
        <p>Token Symbol</p>
        <h6>STAYX</h6>
      </li>
      <li>
        <p>Presale Price</p>
        <h6>0.1¢</h6>
      </li>
      <li>
        <p>Launch Price</p>
        <h6>0.5¢</h6>
      </li>

      <li>
        <span className="inline-flex items-center gap-1 text-white ">
          <p className="hidden md:block">STAYX </p> <p className="pTag ">Stablecoin Conversion Point</p>
        </span>

        <h6> $1</h6>
      </li>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
