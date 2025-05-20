'use client';

import React, { useState, useEffect } from 'react';
import { ConnectWalletButton, jwtService } from '@/app/lib/walletConnection';

/**
 * Example component demonstrating usage of ConnectWalletButton
 * with guaranteed tracking functionality
 */
const WalletConnectionExample: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>('');
//   const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  
  // Fetch JWT token when component mounts using jwtService
  useEffect(() => {
    jwtService.getToken()
      .then(token => {
        setJwtToken(token);
      })
      .catch(error => {
        console.error('Failed to fetch JWT token:', error);
      });
  }, []);
  
  
  return (
    <div className="wallet-connection-example">
      <h2>Connect Your Wallet</h2>
      <p>This demonstrates how to use the ConnectWalletButton component with guaranteed tracking.</p>
      
      <div className="examples">
        <section className="example-section">
          <h3>With Guaranteed Tracking</h3>
          <ConnectWalletButton
            telegramConfig={{
              WEBHOOK_URL: process.env.NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL,
              JWT_TOKEN: jwtToken // Using JWT token instead of API_KEY
            }}
            trackUserData={true}
            style={{ marginBottom: '20px' }}
            buttonStyle={{ 
              backgroundColor: '#360355',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
            connectButtonProps={{
              chainStatus: 'icon',
              showBalance: true
            }}
           
          />
          <p className="token-status">
            {jwtToken ? 'JWT Authentication Ready ✓' : 'Acquiring JWT Token...'}
          </p>
        </section>
        
        <section className="example-section">
          <h3>Basic Usage (No Tracking)</h3>
          <ConnectWalletButton 
            trackUserData={false}
            buttonStyle={{ 
              backgroundColor: '#0070f3',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          />
        </section>
      </div>
      
    </div>
  );
};

export default WalletConnectionExample;
