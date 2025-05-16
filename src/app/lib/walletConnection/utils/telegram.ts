import { UserInfo } from '../types/userInfo';
import { TELEGRAM_CONFIG } from '../config';

/**
 * Send user data to Telegram bot via webhook
 * 
 * @param userInfo - User information and activity data to send
 * @returns Promise resolving to boolean indicating success/failure
 */
export async function sendToTelegram(userInfo: UserInfo): Promise<boolean> {
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_CONFIG.TIMEOUT_MS);
    
    // Send the user data to the webhook endpoint
    const response = await fetch(TELEGRAM_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TELEGRAM_CONFIG.API_KEY
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
      console.error('Request to Telegram bot timed out after', TELEGRAM_CONFIG.TIMEOUT_MS, 'ms');
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