/**
 * JWT Token Management Service
 * 
 * This service handles fetching and managing JWT tokens for authentication
 * with the Telegram webhook API. It caches tokens and refreshes them when needed.
 */
import { TelegramConfigOptions } from '../config';

interface TokenData {
  token: string;
  expiresAt: number;
}

class JwtTokenService {
  private token: TokenData | null = null;
  private tokenRefreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private backoffDelay = 5000; // Start with 5 second delay
  
  /**
   * Fetch a new JWT token from the backend
   * 
   * @returns Promise resolving to the JWT token string
   * @throws Error if token cannot be fetched
   */

  private async fetchNewToken(): Promise<TokenData> {
    try {
      // Try fetching from the backend first (our secure token endpoint)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
      // Make sure this URL points to your actual backend server
      const tokenEndpoint = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${tokenEndpoint}/api/auth/token`, {
        method: 'GET',
        credentials: 'same-origin', // Include cookies for sessions
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Token fetch failed: ${response.status} ${response.statusText}`);
        
        // Fallback to a static token if configured (not recommended for production)
        if (process.env.NEXT_PUBLIC_TELEGRAM_JWT_TOKEN) {
          return {
            token: process.env.NEXT_PUBLIC_TELEGRAM_JWT_TOKEN,
            expiresAt: Date.now() + (23 * 60 * 60 * 1000) // Assume it's good for 23 hours
          };
        }
        
        // If we have no fallback, throw the error
        throw new Error(`Token fetch failed: ${response.status} ${response.statusText}`);
      }
      
      // Process the successful response
      const data = await response.json();
      
      if (!data.token) {
        throw new Error('Invalid token response from server');
      }
      
      // Calculate expiration time (default: 24 hours / 86400000 ms)
      // We'll refresh 10 minutes before expiry for safety
      const expiresInMs = (data.expiresIn || 86400) * 1000;
      const refreshBufferMs = 10 * 60 * 1000; // 10 minutes in ms
      const expiresAt = Date.now() + expiresInMs - refreshBufferMs;
      
      return {
        token: data.token,
        expiresAt
      };
    } catch (error) {
      // Handle timeout errors explicitly
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('JWT token request timed out');
        throw new Error('JWT token request timed out. Please try again later.');
      }
      
      console.error('Error fetching JWT token:', error);
      throw error;
    }
  }
    
  /**
   * Schedule a token refresh before the current token expires
   */
  private scheduleTokenRefresh(): void {
    // Clear any existing timeout
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }
    
    // Don't schedule if we don't have a token or expiry
    if (!this.token) return;
    
    // Calculate time until refresh
    const timeUntilRefresh = Math.max(0, this.token.expiresAt - Date.now());
    
    // Schedule the refresh
    this.tokenRefreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, timeUntilRefresh);
  }
  
  /**
   * Refresh the token using exponential backoff strategy on failure
   * Uses a more robust retry mechanism with max attempts and proper error handling
   */
  private async refreshToken(retryCount = 0): Promise<void> {
    if (this.isRefreshing) return;
    
    const MAX_RETRIES = 3; // Maximum number of automatic retries
    
    this.isRefreshing = true;
    try {
      this.token = await this.fetchNewToken();
      this.backoffDelay = 5000; // Reset backoff delay after success
      this.scheduleTokenRefresh();
    } catch (error) {
      const isLastRetry = retryCount >= MAX_RETRIES;
      
      if (isLastRetry) {
        console.error(`Token refresh failed after ${MAX_RETRIES} attempts:`, error);
        // On final retry failure, we'll try once more when getToken is called
      } else {
        console.warn(`Token refresh attempt ${retryCount + 1}/${MAX_RETRIES + 1} failed, will retry`);
        
        // Calculate exponential backoff with max of 5 minutes
        const delay = Math.min(this.backoffDelay * Math.pow(2, retryCount), 5 * 60 * 1000);
        
        // Schedule retry with exponential backoff
        setTimeout(() => {
          this.isRefreshing = false;
          this.refreshToken(retryCount + 1);
        }, delay);
      }
    } finally {
      // If we're on the last retry or succeeded, mark as not refreshing
      if (retryCount >= MAX_RETRIES) {
        this.isRefreshing = false;
      }
    }
  }
  
  /**
   * Get a valid JWT token, fetching a new one if necessary
   * 
   * @returns Promise resolving to the JWT token string
   */
  public async getToken(): Promise<string> {
    // If we have a valid token, return it
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token.token;
    }
    
    // If we're already refreshing, wait for that to finish
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isRefreshing && this.token) {
            clearInterval(checkInterval);
            resolve(this.token.token);
          }
        }, 100);
      });
    }
    
    // Otherwise, fetch a new token
    try {
      this.token = await this.fetchNewToken();
      this.scheduleTokenRefresh();
      return this.token.token;
    } catch (error) {
      console.error('Failed to get JWT token:', error);
      throw error;
    }
  }
  
  /**
   * Force refresh the token regardless of expiration
   * 
   * @returns Promise resolving to the new JWT token string
   */
  public async forceRefreshToken(): Promise<string> {
    try {
      this.token = await this.fetchNewToken();
      this.scheduleTokenRefresh();
      return this.token.token;
    } catch (error) {
      console.error('Failed to force refresh JWT token:', error);
      throw error;
    }
  }
  
  /**
   * Get a token specifically for the Telegram webhook
   * 
   * @param config - Telegram configuration which might contain a JWT token
   * @returns Promise resolving to the JWT token to use
   */
  public async getTelegramToken(config?: Partial<TelegramConfigOptions>): Promise<string> {
    // If a token is provided in config, use that
    if (config && config.JWT_TOKEN) {
      return config.JWT_TOKEN as string;
    }
    
    // Otherwise, get a token from our service
    return this.getToken();
  }
}

// Export singleton instance
export const jwtService = new JwtTokenService();
