'use client';

import { useEffect } from 'react';
import { initializeUserTracking } from '@/utils/userInfo';
import styles from './page.module.css';

export default function Home() {
  useEffect(() => {
    initializeUserTracking();
  }, []);

  return (
    <main className={styles.main}>
      <h1>Welcome to the User Data App</h1>
      <p>Check the console to see your information</p>
    </main>
  );
}
