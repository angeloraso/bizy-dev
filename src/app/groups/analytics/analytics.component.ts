import { Component, Inject } from '@angular/core';
import { MONTHS } from '@core/constants';
import { CacheService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'analytics',
  templateUrl: 'analytics.html',
  styleUrls: ['analytics.scss'],
  providers: [RouterService]
})
export class AnalyticsComponent {
  group: any;
  currentMonth: string;
  monthCashFlowTotal: number = 0;
  monthCashFlowPercetage: number;
  bestUser: string;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(RouterService) private router: RouterService,
    @Inject(AppService) private appService: AppService,
    @Inject(ToastService) public toastService: ToastService,
    @Inject(CacheService) public cache: CacheService
  ) {
    const month = new Date().getMonth();
    this.currentMonth = MONTHS[month];
  }

  ionViewWillEnter() {
    this.bottomBarService.hide();
    this.monthCashFlowTotal = 0;
    const groupId = this.router.getId('groupId');

    this.bestUser = 'Coming soon';
    this.group = this.cache.getData(CACHE_KEYS.GROUPS)[0];
    if (!this.group) {
      this.appService.getGroups([groupId!]).then(groups => {
        this.group = groups[0];
      });
    }

    this.appService.getGroupRecords(groupId!).then(_records => {
      _records.forEach(_record => {
        this.monthCashFlowTotal += _record.amount;
      });
    });
  }

  goTo(path: string) {
    this.router.goTo(path);
  }

  comingSoon() {
    this.toastService.info('The ranking will be available soon');
  }
}
