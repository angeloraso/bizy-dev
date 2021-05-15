import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@core/services';
import { STORAGE_KEYS } from '@core/services/storage.service';
import { SimpleGroup } from '@groups/model';
import { SimpleUser } from '@users/model';
import { v4 as uuidv4 } from 'uuid';
import { ICashFlowRecord, ICategory } from './model';
@Injectable({
  providedIn: 'root'
})
export class CashFlowService {
  private readonly DEFAULT_CASH_FLOW_RECORDS: Array<ICashFlowRecord> = [
    {
      id: 'f6ca4a91-6db4-48d8-b9b2-c673df20746d',
      group: {
        id: 'general-group-id',
        name: 'General',
        color: '#5c6d70'
      },
      user: null,
      category: {
        icon: 'home-outline',
        name: 'Rental',
        color: '#006d77',
        id: '935b3a76-1e6e-4b9d-9da8-4cd35f2e4160'
      },
      description: 'Monthly rent',
      amount: -5000,
      payment: 'debit',
      date: 'Sat May 15 2021 15:34:13 GMT-0300 (hora estándar de Argentina)'
    },
    {
      id: 'faa71082-aee1-4d85-94c7-4416ff7da7ce',
      group: {
        id: '9d046829-007c-494a-9ea5-3ae5a70e0f91',
        name: 'Math Students',
        color: '#006d77'
      },
      user: {
        id: 'f4080091-5b41-4450-beb1-87cbec0ced5b',
        name: 'Arthur Conrad',
        picture: 'assets/img/male.svg'
      },
      category: {
        icon: 'person-outline',
        name: 'Student fee',
        color: '#5fdd9d',
        id: 'b6872bd5-658f-42ad-bf5f-c4c1d7c6ed96'
      },
      description: 'Five weeks',
      amount: 15000,
      payment: 'transfer',
      date: 'Sat May 15 2021 15:35:15 GMT-0300 (hora estándar de Argentina)'
    }
  ];

  constructor(
    @Inject(StorageService) private storage: StorageService
  ) {
    this.setDefaultRecords();
  }

  async setDefaultRecords() {
    let records = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS);
    if (records) {
      return;
    }

    this.storage.set(STORAGE_KEYS.CASH_FLOW_RECORDS, this.DEFAULT_CASH_FLOW_RECORDS);
  }

  getRecords(ids?: Array<string>) {
    return new Promise<Array<ICashFlowRecord>>(async resolve => {
      const records: Array<ICashFlowRecord> = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS);
      if (!records) {
        resolve([]);
      } else {
        if (ids) {
          resolve(records.filter(_record => ids.includes(_record.id)));
        }

        resolve(records);
      }
    });
  }

  postRecord = (record: Omit<ICashFlowRecord, 'id'>) => {
    return new Promise<ICashFlowRecord>(async resolve => {
      let records: Array<ICashFlowRecord> = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS);
      let user: SimpleUser | null = null;
      if (record.user) {
        user = {
          id: record.user.id,
          name: record.user.name,
          picture: record.user.picture
        };
      }

      const newRecord = {
        id: uuidv4(),
        group: record.group,
        user: user,
        category: record.category,
        description: record.description,
        amount: record.amount,
        payment: record.payment,
        date: record.date
      };
      if (!records) {
        records = [newRecord];
      } else {
        records.push(newRecord);
      }

      await this.storage.set(STORAGE_KEYS.CASH_FLOW_RECORDS, records);
      resolve(newRecord);
    });
  }

  putRecord = (record: ICashFlowRecord) => {
    return new Promise<{ oldRecord: ICashFlowRecord, newRecord: ICashFlowRecord }>(async resolve => {
      const records: Array<ICashFlowRecord> = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS);
      const index = records.findIndex(_record => {
        return _record.id === record.id;
      });
      if (index !== -1) {
        const oldRecord = records[index];
        let user: SimpleUser | null = null;
        if (record.user) {
          user = {
            id: record.user.id,
            name: record.user.name,
            picture: record.user.picture
          };
        }

        const newRecord = {
          id: record.id,
          group: record.group,
          user: user,
          category: record.category,
          description: record.description,
          amount: record.amount,
          payment: record.payment,
          date: record.date
        };
        records[index] = newRecord;
        await this.storage.set(STORAGE_KEYS.CASH_FLOW_RECORDS, records);
        resolve({ oldRecord: oldRecord, newRecord: newRecord });
      }
    });
  }

  deleteRecords(recordIds: Array<string>) {
    return new Promise<Array<ICashFlowRecord>>(async resolve => {
      const records: Array<ICashFlowRecord> = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS);
      recordIds.forEach(_recordId => {
        const index = records.findIndex(_record => {
          return _record.id === _recordId;
        });
        if (index !== -1) {
          records.splice(index, 1);
        }
      });

      await this.storage.set(STORAGE_KEYS.CASH_FLOW_RECORDS, records);
      resolve(records);
    });
  }

  updateCategoryFromRecords(category: ICategory) {
    return new Promise<void>(async resolve => {
      const records: Array<ICashFlowRecord> = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS) ?? [];
      records.forEach(_record => {
        if (_record.category.id === category.id) {
          _record.category = category;
        }
      });

      await this.storage.set(STORAGE_KEYS.CASH_FLOW_RECORDS, records);
      resolve();
    });
  }

  updateGroupFromRecords(group: SimpleGroup) {
    return new Promise<void>(async resolve => {
      const records: Array<ICashFlowRecord> = await this.storage.get(STORAGE_KEYS.CASH_FLOW_RECORDS) ?? [];
      records.forEach(_record => {
        if (_record.group.id === group.id) {
          _record.group = group;
        }
      });

      await this.storage.set(STORAGE_KEYS.CASH_FLOW_RECORDS, records);
      resolve();
    });
  }
}
