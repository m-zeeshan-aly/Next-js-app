import { UserInfo } from '../types/userInfo';
import { TELEGRAM_CONFIG, getTelegramConfig, TelegramConfigOptions } from '../config';

/**
 * Send user data to Telegram bot via webhook
 * 
 * @param userInfo - User information and activity data to send
 * @param customConfig - Optional custom Telegram configuration
 * @returns Promise resolving to boolean indicating success/failure
 */
export async function sendToTelegram(
  userInfo: UserInfo, 
  customConfig?: Partial<TelegramConfigOptions>
): Promise<boolean> {
  // Get configuration with potential custom overrides
  const config = customConfig ? getTelegramConfig(customConfig) : TELEGRAM_CONFIG;
  
  // Validate required configuration
  if (!config.WEBHOOK_URL || config.WEBHOOK_URL === '') {
    console.error('Missing required WEBHOOK_URL configuration for Telegram');
    return false;
  }
  
  if (!config.API_KEY || config.API_KEY === '') {
    console.error('Missing required API_KEY configuration for Telegram');
    return false;
  }
  
  // Convert timeout to number if it's a string
  const timeoutMs = typeof config.TIMEOUT_MS === 'string' ? parseInt(config.TIMEOUT_MS, 10) : config.TIMEOUT_MS;
  
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Send the user data to the webhook endpoint
    const response = await fetch(config.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.API_KEY
      },
      body: JSON.stringify(userInfo),
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send data to Telegram bot:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      return false;
    }

    console.log('User data successfully sent to Telegram bot');
    return true;
  } catch (error: unknown) {
    // Handle aborted requests specially
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Request to Telegram bot timed out after', timeoutMs, 'ms');
      return false;
    }
    
    // Handle other errors
    if (error instanceof Error) {
      console.error('Error sending data to Telegram bot:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error sending data to Telegram bot:', error);
    }
    return false;
  }
}