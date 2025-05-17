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
        <section>
          <h3>Basic Usage</h3>
          <ConnectWalletButton />
        </section>
      </div>
    </div>
  );
};

export default WalletConnectionExample;
