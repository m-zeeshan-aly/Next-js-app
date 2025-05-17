// src/app/lib/walletConnection/providers/WalletProvider.tsx
'use client';
import * as React from 'react';
import { useMemo } from 'react';
import { http, WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  RainbowKitProvider, 
  getDefaultConfig,
  darkTheme,
  lightTheme
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

/**
 * Props for WalletProvider component
 */
export interface WalletProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** WalletConnect Cloud Project ID (defaults to env var or fallback) */
  projectId?: string;
  /** App name displayed in wallet connect UI */
  appName?: string;
  /** Use dark theme for RainbowKit UI */
  useDarkTheme?: boolean;
}

/**
 * WalletProvider component that provides wallet connection capabilities
 * to the application using RainbowKit and Wagmi
 * 
 * @param props - Component props
 * @returns Provider component with all required wallet context
 */
export function WalletProvider({
  children,
  projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '18cf37226e1d295657294f1ae5418c15',
  appName = process.env.NEXT_PUBLIC_APP_NAME || 'Web3 App',
  useDarkTheme = false
}: WalletProviderProps) {
  // Create a new QueryClient instance
  const queryClient = useMemo(() => new QueryClient(), []);

  // Create wagmi config with default settings for RainbowKit
  const wagmiConfig = useMemo(() => {
    return getDefaultConfig({
      appName: appName,
      projectId: projectId,
      chains: [mainnet, polygon, optimism, arbitrum],
      transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
      },
    });
  }, [appName, projectId]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={useDarkTheme ? darkTheme() : lightTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
