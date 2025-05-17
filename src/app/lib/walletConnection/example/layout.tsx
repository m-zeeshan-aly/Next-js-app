"use client";

import { WalletProvider } from '@/app/lib/walletConnection';
import '@rainbow-me/rainbowkit/styles.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>My Web3 App</title>
      </head>
      <body>
        <WalletProvider
          // You can customize these values or use environment variables
          projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
          appName={process.env.NEXT_PUBLIC_APP_NAME || "My Web3 App"}
          useDarkTheme={false}
        >
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
