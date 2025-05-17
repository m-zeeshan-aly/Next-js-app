"use client";

import { useState } from 'react';
import { 
  ConnectWalletButton, 
  WalletInfo, 
  DATA_COLLECTION_CONFIG 
} from '@/app/lib/walletConnection';

export default function Home() {
  const [walletData, setWalletData] = useState<WalletInfo | null>(null);
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">My Web3 Application</h1>
        <p className="text-lg text-gray-600">Connect your wallet to get started</p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
          
          {/* Simple implementation */}
          <div className="mb-8">
            <h3 className="text-xl mb-3">Basic Connection</h3>
            <ConnectWalletButton />
          </div>
          
          {/* Advanced implementation */}
          <div>
            <h3 className="text-xl mb-3">Advanced Connection</h3>
            <p className="text-sm text-gray-500 mb-3">
              With data tracking {DATA_COLLECTION_CONFIG.ENABLED ? 'enabled' : 'disabled'} and custom callback
            </p>
            
            <ConnectWalletButton 
              trackUserData={DATA_COLLECTION_CONFIG.ENABLED}
              chainNames={{ 
                1: "ETH Mainnet", 
                137: "MATIC Network",
                10: "Optimism Network",
                42161: "Arbitrum Network" 
              }}
              onWalletConnected={(info) => {
                console.log("Wallet connected!", info);
                setWalletData(info);
              }}
              connectButtonProps={{
                showBalance: true,
                chainStatus: "icon"
              }}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Wallet Information</h2>
          
          {walletData ? (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="font-medium">Address:</span> 
                <code className="ml-2 p-1 bg-gray-200 rounded">{walletData.address}</code>
              </div>
              
              {walletData.network && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">Network:</span> 
                  <span className="ml-2">{walletData.network.name} (Chain ID: {walletData.network.chainId})</span>
                </div>
              )}
              
              {walletData.balance && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">Balance:</span>
                  <span className="ml-2">{walletData.balance.eth} ETH</span>
                  {walletData.balance.usd && (
                    <span className="ml-1 text-gray-500">(~${walletData.balance.usd})</span>
                  )}
                </div>
              )}
              
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${walletData.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {walletData.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>No wallet connected</p>
              <p className="text-sm mt-2">Connect your wallet to see the data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
