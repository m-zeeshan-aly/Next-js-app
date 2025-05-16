/**
 * Types related to user information and tracking
 */

/**
 * Interface describing user and session information collected by the app
 */
export interface UserInfo {
  /** User's IP address */
  ip: string;
  
  /** Website information */
  websiteInfo: {
    /** Current URL */
    url: string;
    /** Page title */
    title: string;
    /** Referrer URL or 'Direct' */
    referrer: string;
    /** Time spent on page in seconds (optional) */
    timeOnPage?: number;
  };
  
  /** Geolocation information if available */
  location: {
    /** User's city */
    city?: string;
    /** User's country */
    country?: string;
    /** User's region/state */
    region?: string;
  };
  
  /** Device information */
  device: {
    /** Device type classification */
    type: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown';
    /** Browser name */
    browser: string;
    /** Operating system */
    os: string;
    /** User agent string */
    userAgent: string;
  };
  
  /** Wallet information if connected */
  wallet: {
    /** Wallet address */
    address?: string;
    /** Network information */
    network?: {
      /** Network name */
      name: string;
      /** Network chain ID */
      chainId: number;
    };
    /** Wallet balance */
    balance?: {
      /** ETH balance */
      eth: string;
      /** USD equivalent (if available) */
      usd?: string;
    };
    /** Whether wallet is connected */
    isConnected: boolean;
  };
}

/**
 * Wallet information interface
 */
export type WalletInfo = UserInfo['wallet'];

/**
 * Device information interface
 */
export type DeviceInfo = UserInfo['device'];

/**
 * Location information interface
 */
export type LocationInfo = UserInfo['location'];

/**
 * Website information interface
 */
export type WebsiteInfo = UserInfo['websiteInfo'];
