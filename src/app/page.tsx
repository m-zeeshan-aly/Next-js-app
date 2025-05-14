'use client';

import { useEffect } from 'react';
import { initializeUserTracking } from '@/utils/userInfo';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import styles from './page.module.css';

export default function Home() {
  useEffect(() => {
    initializeUserTracking();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.messageSection}>
        <div className={styles.messageContainer}>
          <h2>User Information</h2>
          <p>Your data has been collected and logged to the console</p>
        </div>
      </section>

      <section className={styles.actionSection}>
        <div className={styles.actionContainer}>
          <h2>Take Action</h2>
          <ConnectWalletButton />
        </div>
      </section>
    </main>
  );
}
