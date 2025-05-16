'use client';
import ConnectWalletButton from '@/app/lib/walletConnection/components/ConnectWalletButton';
import styles from './page.module.css';

export default function Home() {


  return (
    <main className={styles.main}>
      <section className={styles.actionSection}>
        <div className={styles.actionContainer}>
          <h2>Take Action</h2>
          <ConnectWalletButton />
        </div>
      </section>
    </main>
  );
}
