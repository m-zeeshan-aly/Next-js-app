/**
 * Configuration settings for API integrations
 */
export const TELEGRAM_CONFIG = {
  // Webhook URL for sending user data to the Telegram bot
  WEBHOOK_URL: process.env.TELEGRAM_WEBHOOK_URL || 'https://a3dd-146-70-238-41.ngrok-free.app/webhook/userinfo',
  
  // API key for authenticating with the webhook
  API_KEY: process.env.TELEGRAM_API_KEY || 'YOUR_SECRET_API_KEY',
  
  // Request timeout in milliseconds
  TIMEOUT_MS: 10000
};

/**
 * Configuration for user information APIs
 */
export const USER_INFO_CONFIG = {
  // API endpoints for gathering user information
  IP_API_URL: process.env.IP_API_URL || 'https://api.ipify.org?format=json',
  GEO_API_URL: process.env.GEO_API_URL || 'https://ipapi.co',
  
  // Request timeout in milliseconds
  API_TIMEOUT_MS: 5000
};

/**
 * Configuration for local storage
 */
export const STORAGE_CONFIG = {
  // Storage key for visit tracking
  VISIT_KEY: 'last_visit',
  
  // Storage security options
  ENCRYPT_STORAGE: process.env.NODE_ENV === 'production'
};

/**
 * Centralized configuration for data collection settings
 */
export const DATA_COLLECTION_CONFIG = {
  // How often to collect and send user data (in hours)
  NOTIFICATION_INTERVAL_HOURS: 12,
  
  // Toggles for data collection features
  COLLECT_DEVICE_INFO: true,
  COLLECT_LOCATION_INFO: true,
  
  // Debug mode for development
  DEBUG_ENABLED: process.env.NODE_ENV !== 'production'
};
