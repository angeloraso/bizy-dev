import { Component, Inject } from '@angular/core';
import { MONTHS } from '@core/constants';
import { CacheService, RouterService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { IAttendanceSheet, IAttendanceSheetUser } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { AppService } from 'src/app/app.service';

interface IAttendanceCounterUser extends IAttendanceSheetUser {
  attendances: number;
}
@Component({
  selector: 'attendance-sheets',
  templateUrl: 'attendance-sheets.html',
  styleUrls: ['attendance-sheets.scss'],
  providers: [RouterService]
})
export class AttendanceSheetsComponent {
  selectedDate: Date;
  dateText: string;
  attendanceSheets: Array<IAttendanceSheet>;
  users: Array<IAttendanceCounterUser>;
  usersMaxLimit: number = 3;
  attendanceSheetsMaxLimit: number = 3;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(CacheService) private cache: CacheService
  ) {}

  async ionViewWillEnter() {
    this.bottomBarService.hide();
    this.selectedDate = new Date();
    this.dateText = MONTHS[this.selectedDate.getMonth()] + ' - ' + this.selectedDate.getFullYear();

    this.getAttendanceSheetsAndUsers();
  }

  getAttendanceSheetsAndUsers() {
    this.attendanceSheets = this.cache.getData(CACHE_KEYS.ATTENDANCE_SHEETS);
    this.users = this.cache.getData(CACHE_KEYS.USERS);
    if (this.attendanceSheets.length === 0 || this.users.length === 0) {
      const groupId = this.router.getId('groupId');

      if (groupId) {
        this.appService.getGroupAttendanceSheets(groupId).then(_attendanceSheets => {
          _attendanceSheets.forEach(_attendanceSheet => {
            if (new Date(_attendanceSheet.date).getMonth() === this.selectedDate.getMonth()) {
              this.attendanceSheets.push(_attendanceSheet);
              _attendanceSheet.users.forEach(_attendanceUser => {
                let userIndex = this.users.findIndex(_user => {
                  return _user.id === _attendanceUser.id;
                });
                if (userIndex === -1) {
                  this.users.push({ ..._attendanceUser, attendances: 0 });
                  userIndex = this.users.length - 1;
                }

                if (_attendanceUser.checked) {
                  this.users[userIndex].attendances++;
                }
              });
            }
          });
          this.users = this.users.sort((_user1, _user2) => (_user1.attendances < _user2.attendances) ? 1 : -1);

          this.saveCache();
        });
      }
    }
  }

  previousMonth() {
    if (this.selectedDate.getMonth() === 0) {
      this.selectedDate = new Date(this.selectedDate.getFullYear() - 1, 11, 1);
    } else {
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1);
    }

    this.dateText = MONTHS[this.selectedDate.getMonth()] + ' - ' + this.selectedDate.getFullYear();
    this.clearCache();
    this.getAttendanceSheetsAndUsers();
  }

  nextMonth() {
    if (this.selectedDate.getMonth() === 11) {
      this.selectedDate = new Date(this.selectedDate.getFullYear() + 1, 0, 1);
    } else {
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
    }

    this.dateText = MONTHS[this.selectedDate.getMonth()] + ' - ' + this.selectedDate.getFullYear();
    this.clearCache();
    this.getAttendanceSheetsAndUsers();
  }

  showMoreUsers() {
    if (this.users.length < this.usersMaxLimit) {
      return;
    }

    if (this.users.length === this.usersMaxLimit) {
      this.usersMaxLimit = 3;
    } else {
      this.usersMaxLimit = this.users.length;
    }
  }

  showMoreAttendanceSheets() {
    if (this.attendanceSheets.length < this.attendanceSheetsMaxLimit) {
      return;
    }

    if (this.attendanceSheets.length === this.attendanceSheetsMaxLimit) {
      this.attendanceSheetsMaxLimit = 3;
    } else {
      this.attendanceSheetsMaxLimit = this.attendanceSheets.length;
    }
  }

  async showUserAttendances(user: IAttendanceCounterUser) {
    this.router.goTo(`users/${user.id}/attendance`);
  }

  showAttendanceSheet(attendanceSheet: IAttendanceSheet) {
    this.router.goTo(attendanceSheet.id, { [CACHE_KEYS.ATTENDANCE_SHEETS]: [attendanceSheet] } as {[key in CACHE_KEYS]: Array<any>});
  }

  saveCache() {
    this.cache.setData(CACHE_KEYS.USERS, this.users);
    this.cache.setData(CACHE_KEYS.ATTENDANCE_SHEETS, this.attendanceSheets);
  }

  clearCache() {
    this.cache.clear(CACHE_KEYS.USERS);
    this.cache.clear(CACHE_KEYS.ATTENDANCE_SHEETS);
  }
}
