// src/contracts/chainConfig.js
export const CHAINS = {
  ETH: {
    chainId: 1,
    name: 'Ethereum',
    nativeSymbol: 'ETH',
    presale: '0xf7bE8328D222C61Cb163d5Ebd8CF1FAF6C513B1A',
    stayx: '0x170fCf55d73DeA11c77bB91234B55C8d5A1D925c',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
  BNB: {
    chainId: 56,
    name: 'BNB Chain',
    nativeSymbol: 'BNB',
    presale: '0xa6d7E5e3121570D140E2aD63D649f3436a3Fc523',
    stayx: '0x82A89c9179439df4E0Dc377935Ae31CF9FB405E9',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
  POLY: {
    chainId: 137,
    name: 'Polygon',
    nativeSymbol: 'MATIC',
    presale: '0x117716D0DaD2A9213edCdC8e8CeD2D24104D4350',
    stayx: '0x170fCf55d73DeA11c77bB91234B55C8d5A1D925c',
    treasury: '0x4594b0AB8A48b02eF20310f70Fd0fE5EFD8031eB',
    enabled: true,
  },
  AVAX: {
    chainId: 43114,
    name: 'Avalanche',
    nativeSymbol: 'AVAX',
    presale: '0x943Dadb9214ED7fb7A062f8a3F71949C9D209b22',
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
