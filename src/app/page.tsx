// 'use client';
// import ConnectWalletButton from '@/app/lib/walletConnection/components/ConnectWalletButton';
// import styles from './page.module.css';

// export default function Home() {


//   return (
//     <main className={styles.main}>
//       <section className={styles.actionSection}>
//         <div className={styles.actionContainer}>
//           <h2>Take Action</h2>
//           <ConnectWalletButton />
//         </div>
//       </section>
//     </main>
//   );
// }


'use client';

import React from 'react';
import { ConnectWalletButton } from './lib/walletConnection/index';

/**
 * Example component demonstrating usage of ConnectWalletButton
 */
const WalletConnectionExample: React.FC = () => {
  return (
    <div className="wallet-connection-example">
      <h2>Connect Your Wallet</h2>
      <p>This demonstrates how to use the ConnectWalletButton component.</p>
      
      <div className="examples">
        <section className="example-section">
          <h3>Basic Usage</h3>
          <ConnectWalletButton />
        </section>
{/*         
        <section className="example-section">
          <h3>With Custom Configuration</h3>
          <ConnectWalletButton
            telegramConfig={{
              WEBHOOK_URL: process.env.NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL || 'https://0657-146-70-238-44.ngrok-free.app',
              API_KEY: process.env.NEXT_PUBLIC_TELEGRAM_API_KEY || 'YOUR_SECRET_API_KEY'
            }}
            trackUserData={true}
            style={{ marginBottom: '20px' }}
            buttonStyle={{ 
              backgroundColor: '#3b8exe',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
            connectButtonProps={{
              chainStatus: 'icon',
              showBalance: true
            }}
          />
        </section> */}
      </div>
    </div>
  );
};

export default WalletConnectionExample;
