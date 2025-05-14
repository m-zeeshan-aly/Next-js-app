interface VisitInfo {
  lastVisit: number;
  expiry: number;
}

export class StorageManager {
  private static EXPIRY_HOURS = 12;
  private static VISIT_KEY = 'last_visit';

  static setVisitTimestamp(): void {
    const now = Date.now();
    const visitInfo: VisitInfo = {
      lastVisit: now,
      expiry: now + (this.EXPIRY_HOURS * 60 * 60 * 1000)
    };
    localStorage.setItem(this.VISIT_KEY, JSON.stringify(visitInfo));
  }

  static shouldNotifyNewVisit(): boolean {
    const visitStr = localStorage.getItem(this.VISIT_KEY);
    if (!visitStr) return true;

    try {
      const visit: VisitInfo = JSON.parse(visitStr);
      const now = Date.now();
      
      if (now > visit.expiry) {
        localStorage.removeItem(this.VISIT_KEY);
        return true;
      }
      return false;
    } catch {
      return true;
    }
  }

  static clearVisitData(): void {
    localStorage.removeItem(this.VISIT_KEY);
  }
}
