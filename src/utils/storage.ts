interface VisitInfo {
  lastVisit: number;
  expiry: number;
}

export class StorageManager {
  private static EXPIRY_HOURS = 12;
  private static VISIT_KEY = 'last_visit';

  static setVisitTimestamp(): void {
    const now = Date.now();
    const visitInfo: VisitInfo = {
      lastVisit: now,
      expiry: now + (this.EXPIRY_HOURS * 60 * 60 * 1000)
    };
    localStorage.setItem(this.VISIT_KEY, JSON.stringify(visitInfo));
  }

  static shouldNotifyNewVisit(): boolean {
    const visitStr = localStorage.getItem(this.VISIT_KEY);
    if (!visitStr) return true;

    try {
      const visit: VisitInfo = JSON.parse(visitStr);
      const now = Date.now();
      
      if (now > visit.expiry) {
        localStorage.removeItem(this.VISIT_KEY);
        return true;
      }
      return false;
    } catch {
      return true;
    }
  }

  static clearVisitData(): void {
    localStorage.removeItem(this.VISIT_KEY);
  }
}




// // src/app/providers/WalletProvider.tsx
// 'use client';
// import * as React from 'react';
// import { http, WagmiProvider } from 'wagmi';
// import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
// import '@rainbow-me/rainbowkit/styles.css';

// const config = getDefaultConfig({
//   appName: 'User Data App',
//   projectId: '18cf37226e1d295657294f1ae5418c15', // WalletConnect Cloud Project ID
//   chains: [mainnet, polygon, optimism, arbitrum],
//   transports: {
//     [mainnet.id]: http(),
//     [polygon.id]: http(),
//     [optimism.id]: http(),
//     [arbitrum.id]: http(),
//   },
// });

// const queryClient = new QueryClient();

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }
