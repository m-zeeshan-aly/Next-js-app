// src/components/ConnectWalletButton.tsx
'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { useEffect, useRef, useCallback } from 'react';
import { initializeUserTracking } from '../utils/userInfo';
import { WalletInfo } from '../types/userInfo';

/**
 * Map of chain IDs to their readable names
 * Used for displaying user-friendly network names
 */
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  137: 'Polygon',
  10: 'Optimism',
  42161: 'Arbitrum One'
};

/**
 * A component that provides wallet connection functionality
 * Tracks user wallet information when connected
 * @returns React component with ConnectButton
 */
export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });
  const isInitialized = useRef(false);

  /**
   * Helper function to get chain name from chainId
   * @param chainId - The numeric chain identifier
   * @returns Human-readable chain name
   */
  const getChainName = useCallback((chainId: number): string => {
    return CHAIN_NAMES[chainId] || 'Unknown Network';
  }, []);

  useEffect(() => {
    // Skip if any required data is missing
    if (!isConnected || !address || !chainId || !balance) {
      if (!isConnected) {
        // Reset the initialization flag when wallet is disconnected
        isInitialized.current = false;
      }
      return;
    }
    
    // Avoid re-initializing if already done
    if (isInitialized.current) {
      return;
    }
    
    // Mark as initialized
    isInitialized.current = true;
    
    // Create wallet info object
    const walletInfo: WalletInfo = {
      address,
      network: {
        chainId,
        name: getChainName(chainId)
      },
      balance: {
        eth: balance.formatted,
        usd: undefined, // USD conversion not implemented yet
      },
      isConnected
    };
    
    // Initialize tracking with the wallet info
    initializeUserTracking(walletInfo).catch(error => {
      console.error('Failed to initialize user tracking:', error);
    });
    
  }, [address, chainId, balance, isConnected, getChainName]);

  return <ConnectButton />;
}
