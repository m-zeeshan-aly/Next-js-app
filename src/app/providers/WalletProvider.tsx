// src/app/providers/WalletProvider.tsx
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

// WalletConnect Cloud Project ID - Should ideally be in environment variables
const PROJECT_ID = '18cf37226e1d295657294f1ae5418c15';

/**
 * WalletProvider component that provides wallet connection capabilities
 * to the application using RainbowKit and Wagmi
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns Provider component with all required wallet context
 */
export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance that persists between renders but is
  // created only once for the component lifecycle
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,      // Retry failed queries up to 3 times
        staleTime: 30000, // Consider data fresh for 30 seconds
      },
    },
  }), []);

  // Create wagmi config with default settings for RainbowKit
  const wagmiConfig = useMemo(() => getDefaultConfig({
    appName: 'User Data App',
    projectId: PROJECT_ID,
    chains: [mainnet, polygon, optimism, arbitrum],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
    },
  }), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
