// src/contracts/chainConfig.js
export const CHAINS = {
  ETH: {
    chainId: 1,
    name: 'Ethereum',
    nativeSymbol: 'ETH',
    presale: '0x98fFC6e3714593EE5E4eD8BCA003fEae649cC365',
    stayx: '0x170fCf55d73DeA11c77bB91234B55C8d5A1D925c',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
  BNB: {
    chainId: 56,
    name: 'BNB Chain',
    nativeSymbol: 'BNB',
    presale: '0xb45694368A6e1581c1634598540F8b7467fb7fD6',
    stayx: '0x82A89c9179439df4E0Dc377935Ae31CF9FB405E9',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
  POLY: {
    chainId: 137,
    name: 'Polygon',
    nativeSymbol: 'MATIC',
    presale: '0x0184a86C8C8178Eb2FD24e69F987cF8a565e4D1f',
    stayx: '0x170fCf55d73DeA11c77bB91234B55C8d5A1D925c',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
  AVAX: {
    chainId: 43114,
    name: 'Avalanche',
    nativeSymbol: 'AVAX',
    presale: '0x0184a86C8C8178Eb2FD24e69F987cF8a565e4D1f',
    stayx: '0x170fCf55d73DeA11c77bB91234B55C8d5A1D925c',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
};

export const PAY_ASSETS = {
  1: ['NATIVE', 'USDC'], // Ethereum
  56: ['NATIVE', 'USDT'], // BNB Chain
  137: ['NATIVE'], // Polygon
  43114: ['NATIVE'], // Avalanche
};
