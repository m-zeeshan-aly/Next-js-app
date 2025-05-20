'use client';

import React from 'react';
import { WalletProvider } from '@/app/lib/walletConnection';
import '@rainbow-me/rainbowkit/styles.css';

export default function ExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider 
      projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '18cf37226e1d295657294f1ae5418c15'}
      appName={process.env.NEXT_PUBLIC_APP_NAME || 'Wallet Connection Example'}
      useDarkTheme={false}
    >
      <div style={{ 
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1>Wallet Connection Component Example</h1>
        <p>
          This demonstrates how to wrap your application with the WalletProvider
          and use the ConnectWalletButton component.
        </p>
        <hr style={{ margin: '2rem 0' }} />
        {children}
      </div>
    </WalletProvider>
  );
}
