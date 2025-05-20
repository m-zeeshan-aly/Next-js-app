import { DATA_COLLECTION_CONFIG, STORAGE_CONFIG } from '../config';

/**
 * Interface defining visit information structure
 */
interface VisitInfo {
  /** Timestamp when the user last visited */
  lastVisit: number;
  
  /** Timestamp when this record expires */
  expiry: number;
  
  /** Optional session identifier */
  sessionId?: string;
}

/**
 * Manages user visit data in browser storage
 */
export class StorageManager {
  private static EXPIRY_HOURS = DATA_COLLECTION_CONFIG.NOTIFICATION_INTERVAL_HOURS;
  private static VISIT_KEY = STORAGE_CONFIG.VISIT_KEY;
  private static isStorageAvailable: boolean | null = null;

  /**
   * Checks if localStorage is available in the current environment
   * @returns Boolean indicating if localStorage can be used
   */
  private static checkStorageAvailability(): boolean {
    if (this.isStorageAvailable !== null) return this.isStorageAvailable;
    
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      this.isStorageAvailable = true;
      return true;
    } catch (e) {
      this.isStorageAvailable = false;
      console.warn('LocalStorage is not available:', e);
      return false;
    }
  }

  /**
   * Records the current visit timestamp in storage
   * @returns True if data was successfully stored
   */
  static setVisitTimestamp(): boolean {
    if (!this.checkStorageAvailability()) return false;
    
    try {
      const now = Date.now();
      const sessionId = crypto.randomUUID?.() || `${now}-${Math.random().toString(36).substring(2, 9)}`;
      
      const visitInfo: VisitInfo = {
        lastVisit: now,
        expiry: now + (this.EXPIRY_HOURS * 60 * 60 * 1000),
        sessionId
      };
      
      localStorage.setItem(this.VISIT_KEY, JSON.stringify(visitInfo));
      
      return true;
    } catch (error) {
      console.error('Failed to set visit timestamp:', error);
      return false;
    }
  }

  /**
   * Determines if we should notify about a new visit based on stored data
   * @returns Boolean indicating if this visit should trigger a notification
   */
  static shouldNotifyNewVisit(): boolean {
    if (!this.checkStorageAvailability()) return true;
    
    try {
      const visitStr = localStorage.getItem(this.VISIT_KEY);
      if (!visitStr) return true;

      const visit = JSON.parse(visitStr) as VisitInfo;
      const now = Date.now();
      
      if (now > visit.expiry) {
        localStorage.removeItem(this.VISIT_KEY);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Error checking visit notification status:', error);
      return true;
    }
  }

  /**
   * Clears stored visit data
   * @returns True if data was successfully cleared
   */
  static clearVisitData(): boolean {
    if (!this.checkStorageAvailability()) return false;
    
    try {
      localStorage.removeItem(this.VISIT_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear visit data:', error);
      return false;
    }
  }
}
