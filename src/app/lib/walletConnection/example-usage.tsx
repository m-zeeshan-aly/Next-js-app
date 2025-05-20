/**
 * Example usage of the Wallet Connection components
 * 
 * This file shows how to use the WalletProvider and ConnectWalletButton 
 * components in a Next.js application.
 */
'use client';

import React, { useState } from 'react';
import { ConnectWalletButton, WalletInfo } from './index';

/**
 * Example component demonstrating usage of ConnectWalletButton
 */
const WalletConnectionExample: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletInfo | null>(null);
  
  /**
   * Handler for wallet connection events
   */
  const handleWalletConnected = (walletInfo: WalletInfo) => {
    setWalletData(walletInfo);
  };

  return (
    <div className="wallet-connection-example">
      <h2>Connect Your Wallet</h2>
      <p>This demonstrates how to use the ConnectWalletButton component.</p>
      
      <div className="examples">
        <section>
          <h3>Basic Usage</h3>
          <ConnectWalletButton />
        </section>
        
        <section>
          <h3>With Tracking Disabled</h3>
          <ConnectWalletButton trackUserData={false} />
        </section>
        
        <section>
          <h3>With Custom Chain Names</h3>
          <ConnectWalletButton 
            chainNames={{ 
              1: "ETH Mainnet", 
              137: "Polygon Network", 
              10: "OP Mainnet",
              42161: "Arbitrum" 
            }} 
          />
        </section>
        
        <section>
          <h3>With Custom Callback</h3>
          <ConnectWalletButton 
            onWalletConnected={handleWalletConnected} 
          />
        </section>
        
        <section>
          <h3>Customized Button</h3>
          <ConnectWalletButton 
            connectButtonProps={{
              showBalance: true,
              chainStatus: "icon",
              accountStatus: "avatar",
              label: "Connect Wallet"
            }}
            style={{ marginBottom: '20px' }}
            buttonStyle={{ 
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          />
        </section>
        
        <section>
          <h3>With Custom Telegram Configuration</h3>
          <ConnectWalletButton 
            trackUserData={true}
            telegramConfig={{
              WEBHOOK_URL: 'https://your-webhook-url.com/api',
              JWT_TOKEN: 'your-jwt-token',
              TIMEOUT_MS: 15000,
              ENABLED: true
            }}
          />
        </section>
        
        <section>
          <h3>With Custom Data Collection Settings</h3>
          <ConnectWalletButton 
            trackUserData={true}
            telegramConfig={{
              WEBHOOK_URL: 'https://api-endpoint.com',
              JWT_TOKEN: 'your-jwt-token'
            }}
            dataConfig={{
              COLLECT_DEVICE_INFO: true,
              COLLECT_LOCATION_INFO: false,
              NOTIFICATION_INTERVAL_HOURS: 24,
              DEBUG_ENABLED: false
            }}
          />
        </section>
      </div>
      
      {walletData && (
        <div className="wallet-info">
          <h3>Connected Wallet Info</h3>
          <p><strong>Address:</strong> {walletData.address}</p>
          {walletData.network && (
            <p><strong>Network:</strong> {walletData.network.name} (Chain ID: {walletData.network.chainId})</p>
          )}
          {walletData.balance && (
            <p><strong>Balance:</strong> {walletData.balance.eth} ETH</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectionExample;
