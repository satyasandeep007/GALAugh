import { Chain } from 'viem';

export const galadriel: Chain = {
  id: 696969,
  name: 'Galadriel',
  nativeCurrency: {
    decimals: 18,
    name: 'Galadriel',
    symbol: 'GAL',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.galadriel.com'],
    },
    public: {
      http: ['https://devnet.galadriel.com'],
    },
  },
  blockExplorers: {
    default: { name: 'GaladrielScan', url: 'https://explorer.galadriel.com' },
  },
};
