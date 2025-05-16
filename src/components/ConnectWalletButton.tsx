// src/components/ConnectWalletButton.tsx
'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { useChainId } from 'wagmi';
import { useEffect, useRef } from 'react';
import { initializeUserTracking } from '../utils/userInfo';
import { WalletInfo } from '../types/userInfo';

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });
  const isInitialized = useRef(false);

  useEffect(() => {
    // When wallet connection status changes
    if (isConnected && !isInitialized.current && address && chainId && balance) {
      isInitialized.current = true;
      
      const walletInfo: WalletInfo = {
        address,
        network: chainId ? {
          chainId,
          name: getChainName(chainId)
        } : undefined,
        balance: balance ? {
          eth: balance.formatted,
          usd: undefined,
        } : undefined,
        isConnected
      };
      initializeUserTracking(walletInfo);

    }

    // Reset the initialization flag when wallet is disconnected
    if (!isConnected) {
      isInitialized.current = false;
    }
  }, [address, chainId, balance, isConnected]);

  return <ConnectButton />;
}

// Helper function to get chain name from chainId
function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum Mainnet',
    137: 'Polygon',
    10: 'Optimism',
    42161: 'Arbitrum One'
  };
  return chains[chainId] || 'Unknown Network';
}
