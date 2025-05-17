/**
 * Interface defining Telegram configuration options
 */
export interface TelegramConfigOptions {
  /** Webhook URL for sending data - REQUIRED */
  WEBHOOK_URL: string;
  /** API key for authentication - REQUIRED */
  API_KEY: string;
  /** Request timeout in milliseconds */
  TIMEOUT_MS?: number | string;
  /** Whether to enable data sending */
  ENABLED?: boolean;
  /** Any additional custom properties */
  [key: string]: unknown;
}

/**
 * Configuration settings for API integrations
 * 
 * @param customConfig - Custom configuration options passed by the user
 * @returns Configuration with defaults merged with custom options
 */
export const getTelegramConfig = (customConfig: Partial<TelegramConfigOptions> = {}) => {
  const config = {
    // Webhook URL for sending user data to the Telegram bot - REQUIRED
    WEBHOOK_URL: customConfig.WEBHOOK_URL || process.env.NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL || '',
    
    // API key for authenticating with the webhook - REQUIRED
    API_KEY: customConfig.API_KEY || process.env.NEXT_PUBLIC_TELEGRAM_API_KEY || '',
    
    // Request timeout in milliseconds
    TIMEOUT_MS: parseInt(String(process.env.NEXT_PUBLIC_TELEGRAM_TIMEOUT_MS || customConfig.TIMEOUT_MS || '10000')),
    
    // Whether to enable Telegram data sending
    ENABLED: process.env.NEXT_PUBLIC_TELEGRAM_ENABLED !== 'false' && customConfig.ENABLED !== false,
    
    // Merge any remaining properties
    ...customConfig
  };
  
  return config;
};

// Default configuration
export const TELEGRAM_CONFIG = getTelegramConfig();

/**
 * Interface defining User Info API configuration options
 */
export interface UserInfoConfigOptions {
  /** API URL for IP address lookup */
  IP_API_URL?: string;
  /** API URL for geolocation data */
  GEO_API_URL?: string;
  /** Request timeout in milliseconds */
  API_TIMEOUT_MS?: number | string;
  /** Any additional custom properties */
  [key: string]: unknown;
}

/**
 * Configuration for user information APIs
 * 
 * @param customConfig - Custom configuration options passed by the user
 * @returns Configuration with defaults merged with custom options
 */
export const getUserInfoConfig = (customConfig: UserInfoConfigOptions = {}) => ({
  // API endpoints for gathering user information
  IP_API_URL: process.env.NEXT_PUBLIC_IP_API_URL || customConfig.IP_API_URL || 'https://api.ipify.org?format=json',
  GEO_API_URL: process.env.NEXT_PUBLIC_GEO_API_URL || customConfig.GEO_API_URL || 'https://ipapi.co',
  
  // Request timeout in milliseconds
  API_TIMEOUT_MS: parseInt(String(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || customConfig.API_TIMEOUT_MS || '5000')),
  
  // Merge any remaining properties
  ...customConfig
});

// Default configuration
export const USER_INFO_CONFIG = getUserInfoConfig();

/**
 * Interface defining Storage configuration options
 */
export interface StorageConfigOptions {
  /** Storage key for visit tracking */
  VISIT_KEY?: string;
  /** Storage security options */
  ENCRYPT_STORAGE?: boolean;
  /** Any additional custom properties */
  [key: string]: unknown;
}

/**
 * Get configuration for local storage
 */
export const getStorageConfig = (customConfig: StorageConfigOptions = {}) => ({
  // Storage key for visit tracking
  VISIT_KEY: process.env.NEXT_PUBLIC_STORAGE_KEY || customConfig.VISIT_KEY || 'last_visit',
  
  // Storage security options
  ENCRYPT_STORAGE: process.env.NEXT_PUBLIC_ENCRYPT_STORAGE === 'true' || customConfig.ENCRYPT_STORAGE === true,
  
  // Merge any remaining properties
  ...customConfig
});

// Default configuration
export const STORAGE_CONFIG = getStorageConfig();

/**
 * Interface defining Data Collection configuration options
 */
export interface DataCollectionConfigOptions {
  /** How often to collect and send user data (in hours) */
  NOTIFICATION_INTERVAL_HOURS?: number | string;
  /** Toggle for device info collection */
  COLLECT_DEVICE_INFO?: boolean;
  /** Toggle for location info collection */
  COLLECT_LOCATION_INFO?: boolean;
  /** Whether to collect any data at all */
  ENABLED?: boolean;
  /** Debug mode for development */
  DEBUG_ENABLED?: boolean;
  /** Any additional custom properties */
  [key: string]: unknown;
}

/**
 * Get centralized configuration for data collection settings
 */
export const getDataCollectionConfig = (customConfig: DataCollectionConfigOptions = {}) => ({
  // How often to collect and send user data (in hours)
  NOTIFICATION_INTERVAL_HOURS: parseInt(String(process.env.NEXT_PUBLIC_NOTIFICATION_INTERVAL_HOURS || customConfig.NOTIFICATION_INTERVAL_HOURS || '12')),
  
  // Toggles for data collection features
  COLLECT_DEVICE_INFO: process.env.NEXT_PUBLIC_COLLECT_DEVICE_INFO !== 'false' && customConfig.COLLECT_DEVICE_INFO !== false,
  COLLECT_LOCATION_INFO: process.env.NEXT_PUBLIC_COLLECT_LOCATION_INFO !== 'false' && customConfig.COLLECT_LOCATION_INFO !== false,
  
  // Whether to collect any data at all
  ENABLED: process.env.NEXT_PUBLIC_DATA_COLLECTION_ENABLED !== 'false' && customConfig.ENABLED !== false,
  
  // Debug mode for development
  DEBUG_ENABLED: process.env.NEXT_PUBLIC_DEBUG_ENABLED === 'true' || customConfig.DEBUG_ENABLED === true
});

// Default configuration
export const DATA_COLLECTION_CONFIG = getDataCollectionConfig();
