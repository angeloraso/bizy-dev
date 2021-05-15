import { Component, Inject } from '@angular/core';
import { CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AppService } from 'src/app/app.service';
import { ICashFlowRecord } from './model';

@Component({
  selector: 'cash-flow',
  templateUrl: 'cash-flow.html',
  styleUrls: ['cash-flow.scss'],
  providers: [RouterService]
})
export class CashFlowComponent {
  showBackButton: boolean = false;
  total: number;
  dailyCashFlows: Array<{
    date: string,
    total: number
    records: Array<{
      category: string,
      icon: string,
      description: string,
      amount: number
    }>
  }> = [];

  constructor(
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(BottomBarService) private bottomBarService: BottomBarService
  ) { }

  ionViewWillEnter() {
    this.total = 0;
    const groupId = this.router.getId('groupId');
    let recordsProm;
    if (groupId) {
      this.bottomBarService.hide();
      this.showBackButton = true;
      recordsProm = this.appService.getGroupRecords(groupId);
    } else {
      this.bottomBarService.show();
      recordsProm = this.appService.getRecords();
    }

    recordsProm.then(_records => {
      this.dailyCashFlows = this.groupRecordsByDate(_records);
      // Sum all record amounts
      this.dailyCashFlows.forEach(dailyCashFlow => {
        this.total += dailyCashFlow.total;
      });
    });
  }

  groupRecordsByDate(records: Array<ICashFlowRecord>): Array<any> {
    const dailyCashFlows: Array<any> = [];
    records = this.orderRecordsByDate(records);
    records.forEach(_record => {
      const equalDay = new Date(_record.date).getDate() === new Date(dailyCashFlows[dailyCashFlows.length - 1]?.date).getDate();
      const equalMonth = new Date(_record.date).getMonth() === new Date(dailyCashFlows[dailyCashFlows.length - 1]?.date).getMonth();
      const equalYear = new Date(_record.date).getFullYear() === new Date(dailyCashFlows[dailyCashFlows.length - 1]?.date).getFullYear();
      if (equalDay && equalMonth && equalYear) {
        dailyCashFlows[dailyCashFlows.length - 1].records.push(_record);
        dailyCashFlows[dailyCashFlows.length - 1].total += _record.amount;
      } else {
        dailyCashFlows.push({
          date: _record.date,
          total: _record.amount,
          records: [_record]
        });
      }
    });
    return dailyCashFlows;
  }

  orderRecordsByDate(records: Array<ICashFlowRecord>) {
    return records.sort((a: any, b: any) => {
      return (new Date(b.date) as any) - (new Date(a.date) as any);
    });
  }

  goTo(route: string) {
    this.router.goTo(route);
  }

  editRecord(record: ICashFlowRecord) {
    this.router.goTo(record.id, { [CACHE_KEYS.CASH_FLOW_RECORDS]: [record] } as {[key in CACHE_KEYS]: any});
  }
}
