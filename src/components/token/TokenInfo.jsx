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
        <p>STAYX Stablecoin Conversion Point</p>
        <h6> $10</h6>
      </li>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
