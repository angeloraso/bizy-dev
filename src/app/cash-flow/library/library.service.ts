import { Inject, Injectable } from '@angular/core';
import { ILibraryRecord } from '@cash-flow/model';
import { GENERAL_CATEGORY, GENERAL_GROUP } from '@core/constants';
import { StorageService } from '@core/services/storage.service';
import { SimpleUser } from '@users/model';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS } from './../../core/services/storage.service';
@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private readonly DEFAULT_LIBRARY_RECORDS: Array<ILibraryRecord> = [
    {
      id: 'ee2b1953-79cc-4d2b-8584-943770d77b57',
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
      date: 'Sat May 15 2021 15:30:14 GMT-0300 (hora estándar de Argentina)',
      name: 'Rental'
    },
    {
      id: 'b41c7b5d-3582-4a3f-bb3f-0c0d113e3048',
      group: {
        id: '9d046829-007c-494a-9ea5-3ae5a70e0f91',
        name: 'Math Students',
        color: '#006d77'
      },
      user: null,
      category: {
        icon: 'person-outline',
        name: 'Student fee',
        color: '#5fdd9d',
        id: 'b6872bd5-658f-42ad-bf5f-c4c1d7c6ed96'
      },
      description: 'Weekly student fee',
      amount: 3000,
      payment: 'transfer',
      date: 'Sat May 15 2021 15:31:01 GMT-0300 (hora estándar de Argentina)',
      name: 'Student fee'
    }
  ];

  constructor(
    @Inject(StorageService) private storage: StorageService
  ) {
    this.setDefaultRecords();
  }

  async setDefaultRecords() {
    let records = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS);
    if (records) {
      return;
    }

    this.storage.set(STORAGE_KEYS.LIBRARY_RECORDS, this.DEFAULT_LIBRARY_RECORDS);
  }

  getLibrary = (ids?: Array<string>) => {
    return new Promise<Array<ILibraryRecord>>(async resolve => {
      const library: Array<ILibraryRecord> = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS);
      if (!library) {
        resolve([]);
      } else {
        if (ids) {
          resolve(library.filter(_record => ids.includes(_record.id)));
        }

        resolve(library);
      }
    });
  }

  postLibrary = (record: Omit<ILibraryRecord, 'id'>) => {
    return new Promise<ILibraryRecord>(async resolve => {
      let library = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS);
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
        date: record.date,
        name: record.name
      };
      if (!library) {
        library = [newRecord];
      } else {
        library.push(newRecord);
      }

      await this.storage.set(STORAGE_KEYS.LIBRARY_RECORDS, library);
      resolve(newRecord);
    });
  }

  putLibrary = (record: ILibraryRecord) => {
    return new Promise<void>(async resolve => {
      const library: Array<ILibraryRecord> = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS);
      const index = library.findIndex(_record => {
        return _record.id === record.id;
      });
      if (index !== -1) {
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
          date: record.date,
          name: record.name
        };
        library[index] = newRecord;
      }

      await this.storage.set(STORAGE_KEYS.LIBRARY_RECORDS, library);
      resolve();
    });
  }

  deleteLibrary(recordIds: Array<string>) {
    return new Promise<void>(async resolve => {
      const library: Array<ILibraryRecord> = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS);
      recordIds.forEach(_recordId => {
        const index = library.findIndex(_record => {
          return _record.id === _recordId;
        });
        if (index !== -1) {
          library.splice(index, 1);
        }
      });

      await this.storage.set(STORAGE_KEYS.LIBRARY_RECORDS, library);
      resolve();
    });
  }

  removeCategoriesFromLibrary(categoriesIds: Array<string>) {
    return new Promise<void>(async resolve => {
      const library: Array<ILibraryRecord> = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS) ?? [];
      categoriesIds.forEach(_id => {
        library.forEach(_libraryRecord => {
          if (_libraryRecord.category.id === _id) {
            _libraryRecord.category = GENERAL_CATEGORY;
          }
        });
      });

      await this.storage.set(STORAGE_KEYS.LIBRARY_RECORDS, library);
      resolve();
    });
  }

  removeGroupsFromLibrary(groupIds: Array<string>) {
    return new Promise<void>(async resolve => {
      const library: Array<ILibraryRecord> = await this.storage.get(STORAGE_KEYS.LIBRARY_RECORDS) ?? [];
      groupIds.forEach(_id => {
        library.forEach(_libraryRecord => {
          if (_libraryRecord.group.id === _id) {
            _libraryRecord.group = GENERAL_GROUP;
          }
        });
      });

      await this.storage.set(STORAGE_KEYS.LIBRARY_RECORDS, library);
      resolve();
    });
  }
}
