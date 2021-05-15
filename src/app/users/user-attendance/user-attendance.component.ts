import { Component, Inject } from '@angular/core';
import { ICalendarEvent } from '@components/event-calendar/event-calendar.component';
import { MONTHS } from '@core/constants';
import { CacheService, RouterService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'user-attendance',
  templateUrl: 'user-attendance.html',
  providers: [RouterService]
})
export class UserAttendanceComponent {
  selectedDate: Date = new Date();
  dateText: string;
  attendanceEvents: Array<ICalendarEvent> = [];

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(CacheService) private cache: CacheService,
    @Inject(RouterService) private router: RouterService
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.hide();
    this.dateText = MONTHS[this.selectedDate.getMonth()] + ' - ' + this.selectedDate.getFullYear();
    const userId = this.router.getId('userId');
    const groupId = this.router.getId('groupId');
    this.appService.getUserAttendance(userId!).then(attendance => {
      if (groupId) {
        attendance = attendance.filter(_attendanceEvent => {
          return _attendanceEvent.group.id === groupId;
        });
      }

      attendance.forEach(_attendanceEvent => {
        this.attendanceEvents.push(
          {
            name: _attendanceEvent.group.name,
            date: new Date(_attendanceEvent.date),
            color: _attendanceEvent.group.color
          }
        );
      });

      // Force change detection
      this.attendanceEvents = [...this.attendanceEvents];

      this.saveCache();
    });
  }

  previousMonth() {
    if (this.selectedDate.getMonth() === 0) {
      this.selectedDate = new Date(this.selectedDate.getFullYear() - 1, 11, 1);
    } else {
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1);
    }

    this.dateText = MONTHS[this.selectedDate.getMonth()] + ' - ' + this.selectedDate.getFullYear();
    this.clearCache();
  }

  nextMonth() {
    if (this.selectedDate.getMonth() === 11) {
      this.selectedDate = new Date(this.selectedDate.getFullYear() + 1, 0, 1);
    } else {
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
    }

    this.dateText = MONTHS[this.selectedDate.getMonth()] + ' - ' + this.selectedDate.getFullYear();
    this.clearCache();
  }

  saveCache() {
    this.cache.setData(CACHE_KEYS.USER_ATTENDANCE, this.attendanceEvents);
  }

  clearCache() {
    this.cache.clear(CACHE_KEYS.USER_ATTENDANCE);
  }
}
