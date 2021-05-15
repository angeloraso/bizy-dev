import { Injectable } from '@angular/core';

export enum CACHE_KEYS {
  CATEGORIES = 'CATEGORIES',
  LIBRARY_RECORDS = 'LIBRARY_RECORDS',
  CASH_FLOW_RECORDS = 'CASH_FLOW_RECORDS',
  USERS = 'USERS',
  GROUPS = 'GROUPS',
  ATTENDANCE_SHEETS = 'ATTENDANCE_SHEETS',
  USER_ATTENDANCE = 'USER_ATTENDANCE'
}
@Injectable()
export class CacheService {
  getData(key: CACHE_KEYS) {
    if (!sessionStorage.getItem(key)) {
      return [];
    }

    return JSON.parse(sessionStorage.getItem(key) as string) as Array<any>;
  }

  setData(key: CACHE_KEYS, data: Array<any>) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  clear(key: CACHE_KEYS) {
    sessionStorage.removeItem(key);
  }

  clearAll() {
    sessionStorage.clear();
  }
}

