// src/app/lib/walletConnection/components/ConnectWalletButton.tsx
'use client';
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { useEffect, useRef, useCallback } from 'react';
import { initializeUserTracking } from '../utils/userInfo';
import { WalletInfo } from '../types/userInfo';
import { DATA_COLLECTION_CONFIG, TelegramConfigOptions, getTelegramConfig, UserInfoConfigOptions, getUserInfoConfig, DataCollectionConfigOptions, getDataCollectionConfig } from '../config';

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
  /** Styling options for the button */
  style?: React.CSSProperties;
  /** CSS class name for the button container */
  className?: string;
  /** Custom Telegram configuration - WEBHOOK_URL and API_KEY required when trackUserData is true */
  telegramConfig?: Partial<TelegramConfigOptions>;
  /** Custom user info configuration */
  userInfoConfig?: UserInfoConfigOptions;
  /** Custom data collection configuration */
  dataConfig?: DataCollectionConfigOptions;
  /** Button appearance styling */
  buttonStyle?: React.CSSProperties;
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
  connectButtonProps = {},
  style,
  className,
  buttonStyle,
  telegramConfig: customTelegramConfig,
  userInfoConfig: customUserInfoConfig,
  dataConfig: customDataConfig
}: ConnectWalletButtonProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });
  const isInitialized = useRef(false);
  
  // Apply custom configurations
  const telegramConfig = useCallback(() => getTelegramConfig(customTelegramConfig || {}), [customTelegramConfig])();
  
  // Process configs but don't store as variables to avoid unused variable warnings
  useCallback(() => getUserInfoConfig(customUserInfoConfig || {}), [customUserInfoConfig])();
  useCallback(() => getDataCollectionConfig(customDataConfig || {}), [customDataConfig])();
  
  // Validate required configuration when tracking is enabled
  useEffect(() => {
    if (trackUserData) {
      // Check for required webhook URL and API key
      if (!telegramConfig.WEBHOOK_URL || telegramConfig.WEBHOOK_URL === '') {
        console.error('ConnectWalletButton: Missing required WEBHOOK_URL configuration');
        throw new Error('ConnectWalletButton: WEBHOOK_URL is required when user data tracking is enabled. Please provide it via telegramConfig or set NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL in your environment.');
      }
      
      if (!telegramConfig.API_KEY || telegramConfig.API_KEY === '') {
        console.error('ConnectWalletButton: Missing required API_KEY configuration');
        throw new Error('ConnectWalletButton: API_KEY is required when user data tracking is enabled. Please provide it via telegramConfig or set NEXT_PUBLIC_TELEGRAM_API_KEY in your environment.');
      }
    }
  }, [trackUserData, telegramConfig]);

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

  return (
    <div className={className} style={style}>
      <div style={buttonStyle}>
        <ConnectButton {...connectButtonProps} />
      </div>
    </div>
  );
}
