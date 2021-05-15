import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@core/services/storage.service';
import { IAttendanceSheet } from '@groups/model';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS } from './../../core/services/storage.service';
import { IAttendanceEvent, IAttendanceSheetUser } from './../model';
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(
    @Inject(StorageService) private storage: StorageService
  ) {}

  getAttendanceSheets = (ids?: Array<string>) => {
    return new Promise<Array<any>>(async resolve => {
      const attendances: Array<IAttendanceSheet> = await this.storage.get(STORAGE_KEYS.ATTENDANCE_SHEETS);
      if (!attendances) {
        resolve([]);
      } else {
        if (ids) {
          resolve(attendances.filter(_attendance => ids.includes(_attendance.id)));
          return;
        }

        resolve(attendances);
      }
    });
  }

  postAttendanceSheet = (attendanceSheet: Omit<IAttendanceSheet, 'id'>) => {
    return new Promise<IAttendanceSheet>(async resolve => {
      let attendanceSheets: Array<IAttendanceSheet> = await this.storage.get(STORAGE_KEYS.ATTENDANCE_SHEETS);
      attendanceSheet.users = attendanceSheet.users.map(_user => {
        return {
          id: _user.id,
          name: _user.name,
          picture: _user.picture,
          checked: _user.checked
        };
      }) as Array<IAttendanceSheetUser>;
      const newAttendanceSheet: IAttendanceSheet = {
        id: uuidv4(),
        group: {
          id: attendanceSheet.group.id,
          name: attendanceSheet.group.name,
          color: attendanceSheet.group.color
        },
        users: attendanceSheet.users,
        date: attendanceSheet.date
      };

      if (!attendanceSheets) {
        attendanceSheets = [newAttendanceSheet];
      } else {
        attendanceSheets.push(newAttendanceSheet);
      }

      await this.storage.set(STORAGE_KEYS.ATTENDANCE_SHEETS, attendanceSheets);
      resolve(newAttendanceSheet);
    });
  }

  putAttendanceSheet = (attendanceSheet: IAttendanceSheet) => {
    return new Promise<void>(async resolve => {
      const attendanceSheets: Array<IAttendanceSheet> = await this.storage.get(STORAGE_KEYS.ATTENDANCE_SHEETS);
      const index = attendanceSheets.findIndex(_attendanceSheet => {
        return _attendanceSheet.id === attendanceSheet.id;
      });
      if (index !== -1) {
        const newAttendanceSheet = {
          id: attendanceSheet.id,
          group: attendanceSheet.group,
          users: attendanceSheet.users,
          date: attendanceSheet.date
        };
        attendanceSheets[index] = newAttendanceSheet;
      }

      await this.storage.set(STORAGE_KEYS.ATTENDANCE_SHEETS, attendanceSheets);
      resolve();
    });
  }

  deleteAttendanceSheets = (attendanceSheetsIds: Array<string>) => {
    return new Promise<void>(async resolve => {
      const attendanceSheets: Array<IAttendanceSheet> = await this.storage.get(STORAGE_KEYS.ATTENDANCE_SHEETS) ?? [];
      attendanceSheetsIds.forEach(_id => {
        const index = attendanceSheets.findIndex(_attendanceSheet => {
          return _attendanceSheet.id === _id;
        });
        if (index !== -1) {
          attendanceSheets.splice(index, 1);
        }
      });
      await this.storage.set(STORAGE_KEYS.ATTENDANCE_SHEETS, attendanceSheets);
      resolve();
    });
  }

  getUserAttendance = (id: string) => {
    return new Promise<Array<IAttendanceEvent>>(async (resolve, reject) => {
      if (!id) {
        reject();
        return;
      }

      const attendanceSheets: Array<IAttendanceSheet> = await this.storage.get(STORAGE_KEYS.ATTENDANCE_SHEETS);
      if (!attendanceSheets) {
        resolve([]);
      } else {
        const attendanceEvents: Array<IAttendanceEvent> = [];
        attendanceSheets.forEach(_attendanceSheet => {
          const user = _attendanceSheet.users.find(_user => {
            return _user.id === id;
          });
          if (user?.checked) {
            attendanceEvents.push(
              {
                group: _attendanceSheet.group,
                date: _attendanceSheet.date
              }
            );
          }
        });
        resolve(attendanceEvents);
      }
    });
  }
}
