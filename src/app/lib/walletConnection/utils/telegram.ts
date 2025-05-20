import { UserInfo } from '../types/userInfo';
import { TELEGRAM_CONFIG, getTelegramConfig, TelegramConfigOptions } from '../config';
import { StorageManager } from './storage';

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
  // First check if we should send notification based on stored expiry
  if (!StorageManager.shouldNotifyNewVisit()) {
    return false;
  }

  // Get configuration with potential custom overrides
  const config = customConfig ? getTelegramConfig(customConfig) : TELEGRAM_CONFIG;
  
   // Check for webhook URL - this should be handled in getTelegramConfig
  if (!config.WEBHOOK_URL) {
    console.error('Webhook URL is required. Cannot send notification without a valid webhook URL.');
    return false;
  }
  
  // Check for JWT token authentication - Required
  const hasJwtToken = config.JWT_TOKEN && config.JWT_TOKEN !== '';
  
  // If no JWT token, cannot proceed
  if (!hasJwtToken) {
    console.error('JWT token required for authentication. Cannot send notification without a valid JWT token.');
    return false;
  }
  
  // Convert timeout to number if it's a string
  const timeoutMs = typeof config.TIMEOUT_MS === 'string' ? parseInt(config.TIMEOUT_MS, 10) : config.TIMEOUT_MS;
  
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Prepare headers based on JWT token authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    headers['Authorization'] = `Bearer ${config.JWT_TOKEN}`;
    
    // Add token expiry validation timestamp (helps server verify the token is fresh)
    headers['X-Auth-Timestamp'] = Math.floor(Date.now() / 1000).toString();
    
    // Send the user data to the webhook endpoint
    const response = await fetch(`${config.WEBHOOK_URL}/webhook/userinfo`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userInfo),
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      // const errorText = await response.text();
      await response.text();
      
      // Handle authentication errors specifically
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication failed with Telegram webhook. JWT token may have expired:', {
          status: response.status,
          statusText: response.statusText
        });
        
        // If using JWT and it failed, it might be expired
        if (config.JWT_TOKEN && config.JWT_TOKEN !== '') {
          console.warn('JWT authentication failed. Token will be refreshed on next attempt.');
        }
      } else {
        // General error handling
        console.error('Failed to send data to Telegram bot:', {
          status: response.status,
          statusText: response.statusText
        });
      }
      return false;
    }

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
        name: error.name
      });
    } else {
      console.error('Unknown error sending data to Telegram bot:', error);
    }
    return false;
  }
}