import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

export enum STORAGE_KEYS {
  CATEGORIES = 'CATEGORIES',
  LIBRARY_RECORDS = 'LIBRARY_RECORDS',
  CASH_FLOW_RECORDS = 'CASH_FLOW_RECORDS',
  USERS = 'USERS',
  GROUPS = 'GROUPS',
  ATTENDANCE_SHEETS = 'ATTENDANCE_SHEETS',
  VERSION = 'VERSION'
}

@Injectable()
export class StorageService {
  async set(key: string, value: any): Promise<void> {
    await Storage.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  async get(key: string): Promise<any> {
    const item = await Storage.get({ key: key });
    return item.value ? JSON.parse(item.value) : null;
  }

  async clear(): Promise<void> {
    await Storage.clear();
  }

  async keys(): Promise<void> {
    await Storage.keys();
  }

  async remove(key: string): Promise<void> {
    await Storage.remove({
      key: key
    });
  }
}
