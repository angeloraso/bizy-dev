import { Component, Inject } from '@angular/core';
import { CacheService, CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'group',
  templateUrl: 'group.html',
  styleUrls: ['group.scss'],
  providers: [RouterService]
})
export class GroupComponent {
  group: any;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(RouterService) private router: RouterService,
    @Inject(AppService) private appService: AppService,
    @Inject(CacheService) private cache: CacheService
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.show();
    this.group = this.cache.getData(CACHE_KEYS.GROUPS)[0];
    if (!this.group) {
      const groupId = this.router.getId('groupId');
      this.appService.getGroups([groupId!]).then(_groups => {
        this.group = _groups[0];
      });
    }
  }

  goTo(path: string) {
    this.router.goTo(path, { [CACHE_KEYS.GROUPS]: [this.group] } as {[key in CACHE_KEYS]: any});
  }
}
