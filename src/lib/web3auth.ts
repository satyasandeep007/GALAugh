import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { decodeToken, Web3Auth } from '@web3auth/single-factor-auth';

// Get this from .env file
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? '';

export const chainConfig = {
  sepolia: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0xaa36a7',
    rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
    displayName: 'Ethereum Sepolia Testnet',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  galadrielDevnet: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0xAA289',
    rpcTarget: 'https://devnet.galadriel.com',
    displayName: 'Galadriel Devnet',
    blockExplorerUrl: 'https://explorer.galadriel.com',
    ticker: 'GAL',
    tickerName: 'GAL',
    logo: 'https://github.com/base-org/brand-kit/blob/main/logo/symbol/Base_Symbol_Blue.svg',
  },
};

export const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chainConfig.galadrielDevnet,
  },
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

export { decodeToken };
