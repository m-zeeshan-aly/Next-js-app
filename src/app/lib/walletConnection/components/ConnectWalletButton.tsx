// src/app/lib/walletConnection/components/ConnectWalletButton.tsx
'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { useEffect, useRef, useCallback } from 'react';
import { initializeUserTracking } from '../utils/userInfo';
import { WalletInfo } from '../types/userInfo';
import { DATA_COLLECTION_CONFIG } from '../config';

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
 * Props for ConnectWalletButton component
 */
export interface ConnectWalletButtonProps {
  /** Whether to track user data when wallet is connected */
  trackUserData?: boolean;
  /** Custom chain names mapping */
  chainNames?: Record<number, string>;
  /** Additional callback when wallet connects successfully */
  onWalletConnected?: (walletInfo: WalletInfo) => void;
  /** RainbowKit ConnectButton props (passed through) */
  connectButtonProps?: {
    showBalance?: boolean;
    chainStatus?: 'full' | 'icon' | 'name' | 'none';
    accountStatus?: 'full' | 'avatar' | 'address';
    label?: string;
    [key: string]: unknown;
  };
}

/**
 * A component that provides wallet connection functionality
 * Optionally tracks user wallet information when connected
 * 
 * @param props - Component props
 * @returns React component with ConnectButton
 */
export default function ConnectWalletButton({
  trackUserData = DATA_COLLECTION_CONFIG.ENABLED,
  chainNames = CHAIN_NAMES,
  onWalletConnected,
  connectButtonProps = {}
}: ConnectWalletButtonProps) {
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
    return chainNames[chainId] || 'Unknown Network';
  }, [chainNames]);

  useEffect(() => {
    // Skip if any required data is missing or tracking is disabled
    if (!trackUserData || !isConnected || !address || !chainId || !balance) {
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
    
    // Call custom onWalletConnected handler if provided
    if (onWalletConnected) {
      onWalletConnected(walletInfo);
    }
    
    // Initialize tracking with the wallet info
    if (trackUserData) {
      initializeUserTracking(walletInfo).catch(error => {
        console.error('Failed to initialize user tracking:', error);
      });
    }
    
  }, [address, chainId, balance, isConnected, getChainName, trackUserData, onWalletConnected]);

  return <ConnectButton {...(connectButtonProps || {})} />;
}
