import { Component, Inject } from '@angular/core';
import { CacheService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { IAttendanceSheet, IGroup } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { IAttendanceSheetUser } from './../model';
@Component({
  selector: 'attendance',
  templateUrl: 'attendance.html',
  styleUrls: ['attendance.scss'],
  providers: [RouterService]
})
export class AttendanceComponent {
  search: string;
  group: IGroup;
  attendanceSheets: Array<IAttendanceSheet>;
  attendanceSheet: Partial<IAttendanceSheet>;
  currentAttendanceSheet: number = 0;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(ToastService) private toastService: ToastService,
    @Inject(CacheService) private cache: CacheService,
    @Inject(AlertController) private alertController: AlertController
  ) {}

  async ionViewWillEnter() {
    this.bottomBarService.hide();
    this.attendanceSheets = this.cache.getData(CACHE_KEYS.ATTENDANCE_SHEETS);
    if (this.attendanceSheets.length === 0) {
      this.appService.getAttendanceSheets().then(_attendanceSheets => {
        this.attendanceSheets = _attendanceSheets;
        this.currentAttendanceSheet = this.attendanceSheets.length;
        this.cache.setData(CACHE_KEYS.ATTENDANCE_SHEETS, this.attendanceSheets);
      });
    } else {
      this.currentAttendanceSheet = this.attendanceSheets.length;
    }

    let groups = this.cache.getData(CACHE_KEYS.GROUPS);
    if (groups.length === 0) {
      const groupId = this.router.getId('groupId');
      groups = await this.appService.getGroups([groupId!]);
    }

    if (groups.length > 0) {
      this.group = groups[0];
      this.cache.setData(CACHE_KEYS.GROUPS, [this.group]);

      this.attendanceSheet = {
        date: new Date().toString(),
        group: this.group,
        users: this.group.users.map((_user: any) => {
          _user.checked = false;
          return _user as IAttendanceSheetUser;
        })
      };
    }
  }

  async showDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete attendance sheet',
      message: 'The attendance sheet will be deleted. Do you agree?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteAttendanceSheet();
          }
        }
      ]
    });

    await alert.present();
  }

  previousAttendanceSheet() {
    this.currentAttendanceSheet--;
    this.attendanceSheet = this.attendanceSheets[this.currentAttendanceSheet];
  }

  nextAttendanceSheet() {
    this.currentAttendanceSheet++;
    if (this.attendanceSheets[this.currentAttendanceSheet]) {
      this.attendanceSheet = this.attendanceSheets[this.currentAttendanceSheet];
    } else {
      this.attendanceSheet = {
        date: new Date().toString(),
        group: this.group,
        users: this.group.users.map((_user: any) => {
          _user.checked = false;
          return _user as IAttendanceSheetUser;
        })
      };
    }
  }

  deleteAttendanceSheet() {
    if (!this.attendanceSheet.id) {
      this.attendanceSheet.users?.forEach(_user => {
        _user.checked = false;
      });
      this.attendanceSheet.date = new Date().toString();
      this.toastService.success('Attendance sheet was deleted');
      return;
    }

    this.appService.deleteAttendanceSheet(this.attendanceSheet.id).then(() => {
      const index = this.attendanceSheets.findIndex(_attendanceSheet => {
        return _attendanceSheet.id === this.attendanceSheet.id;
      });
      this.attendanceSheets.splice(index, 1);
      this.currentAttendanceSheet--;
      this.nextAttendanceSheet();
      this.toastService.success('Attendance sheet was deleted');
    });
  }

  save() {
    if (this.attendanceSheet.id) {
      this.appService.editAttendanceSheet(this.attendanceSheet as IAttendanceSheet).then(() => {
        this.toastService.success('Attendance sheet was edited');
        this.goBack();
      });
    } else {
      this.appService.createAttendanceSheet(this.attendanceSheet as IAttendanceSheet).then(() => {
        this.toastService.success('Attendance sheet was saved');
        this.goBack();
      });
    }
  }

  goBack() {
    this.clearCache();
    this.router.goBack();
  }

  goToGroupUsers() {
    const groupId = this.router.getId('groupId');
    this.router.goTo(`/-/home/groups/${groupId}/users`);
  }

  saveCache() {
    this.cache.setData(CACHE_KEYS.GROUPS, [this.group]);
    this.cache.setData(CACHE_KEYS.ATTENDANCE_SHEETS, this.attendanceSheets);
  }

  clearCache() {
    this.cache.clear(CACHE_KEYS.GROUPS);
    this.cache.clear(CACHE_KEYS.ATTENDANCE_SHEETS);
  }
}
