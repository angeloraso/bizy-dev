import { Component, Inject } from '@angular/core';
import { CacheService, RouterService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { IAttendanceSheet } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'attendance-sheet',
  templateUrl: 'attendance-sheet.html',
  styleUrls: ['attendance-sheet.scss'],
  providers: [RouterService]
})
export class AttendanceSheetComponent {
  attendanceSheet: IAttendanceSheet;
  search: string;

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
    const attendanceSheets = this.cache.getData(CACHE_KEYS.ATTENDANCE_SHEETS);
    if (attendanceSheets.length > 0) {
      this.attendanceSheet = attendanceSheets[0];
    } else {
      const attendanceSheetId = this.router.getId('attendanceSheetId');
      this.appService.getAttendanceSheets([attendanceSheetId!]).then(_attendanceSheets => {
        this.attendanceSheet = _attendanceSheets[0];
        this.cache.setData(CACHE_KEYS.ATTENDANCE_SHEETS, [this.attendanceSheet]);
      });
    }
  }

  async showDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete attendance sheet',
      message: 'The attendance shet will be deleted. Do you agree?',
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

  deleteAttendanceSheet() {
    this.appService.deleteAttendanceSheet(this.attendanceSheet.id).then(() => {
      this.router.goBack();
      this.toastService.success('Attendance sheet was deleted');
    });
  }

  clearCache() {
    this.cache.clear(CACHE_KEYS.ATTENDANCE_SHEETS);
  }
}
