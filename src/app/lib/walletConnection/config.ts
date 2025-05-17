/**
 * Configuration settings for API integrations
 * 
 * @param customConfig - Custom configuration options passed by the user
 * @returns Configuration with defaults merged with custom options
 */
export const getTelegramConfig = (customConfig = {}) => ({
  // Webhook URL for sending user data to the Telegram bot
  WEBHOOK_URL: process.env.NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL || 'https://0490-146-70-238-45.ngrok-free.app/webhook/userinfo',
  
  // API key for authenticating with the webhook
  API_KEY: process.env.NEXT_PUBLIC_TELEGRAM_API_KEY || 'YOUR_SECRET_API_KEY',
  
  // Request timeout in milliseconds
  TIMEOUT_MS: parseInt(process.env.NEXT_PUBLIC_TELEGRAM_TIMEOUT_MS || '10000'),
  
  // Whether to enable Telegram data sending
  ENABLED: process.env.NEXT_PUBLIC_TELEGRAM_ENABLED !== 'false',
  
  // Merge with custom config
  ...customConfig
});

// Default configuration
export const TELEGRAM_CONFIG = getTelegramConfig();

/**
 * Configuration for user information APIs
 * 
 * @param customConfig - Custom configuration options passed by the user
 * @returns Configuration with defaults merged with custom options
 */
export const getUserInfoConfig = (customConfig = {}) => ({
  // API endpoints for gathering user information
  IP_API_URL: process.env.NEXT_PUBLIC_IP_API_URL || 'https://api.ipify.org?format=json',
  GEO_API_URL: process.env.NEXT_PUBLIC_GEO_API_URL || 'https://ipapi.co',
  
  // Request timeout in milliseconds
  API_TIMEOUT_MS: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || '5000'),
  
  // Merge with custom config
  ...customConfig
});

// Default configuration
export const USER_INFO_CONFIG = getUserInfoConfig();

/**
 * Configuration for local storage
 */
export const STORAGE_CONFIG = {
  // Storage key for visit tracking
  VISIT_KEY: process.env.NEXT_PUBLIC_STORAGE_KEY || 'last_visit',
  
  // Storage security options
  ENCRYPT_STORAGE: process.env.NEXT_PUBLIC_ENCRYPT_STORAGE === 'true'
};

/**
 * Centralized configuration for data collection settings
 */
export const DATA_COLLECTION_CONFIG = {
  // How often to collect and send user data (in hours)
  NOTIFICATION_INTERVAL_HOURS: parseInt(process.env.NEXT_PUBLIC_NOTIFICATION_INTERVAL_HOURS || '12'),
  
  // Toggles for data collection features
  COLLECT_DEVICE_INFO: process.env.NEXT_PUBLIC_COLLECT_DEVICE_INFO !== 'false',
  COLLECT_LOCATION_INFO: process.env.NEXT_PUBLIC_COLLECT_LOCATION_INFO !== 'false',
  
  // Whether to collect any data at all
  ENABLED: process.env.NEXT_PUBLIC_DATA_COLLECTION_ENABLED !== 'false',
  
  // Debug mode for development
  DEBUG_ENABLED: process.env.NEXT_PUBLIC_DEBUG_ENABLED === 'true'
};
