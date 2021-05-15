import { Component, Inject } from '@angular/core';
import { MENU_OPTIONS } from '@core/constants';
import { CheckForUpdateService } from '@core/services';
import { RouterService } from '@core/services/router.service';
import { SideMenuService } from '@side-menu/side-menu.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { BottomBarService } from './bottomBar.service';

@Component({
  selector: 'home',
  templateUrl: 'home.html',
  providers: [RouterService]
})
export class HomeComponent {
  private subscription = new Subscription();
  showTabsFromApp: boolean;
  showTabsFromSideMenu: boolean;
  options = MENU_OPTIONS;
  badge: {show: boolean, path: string};

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(RouterService) private router: RouterService,
    @Inject(SideMenuService) private sideMenuService: SideMenuService
  ) {}

  ionViewDidEnter() {
    this.bottomBarService.bottomBar.subscribe(res => {
      this.showTabsFromApp = res;
    });

    this.subscription.add(this.sideMenuService.open.subscribe(isOpen => {
      this.showTabsFromSideMenu = !isOpen;
    }));

    this.subscription.add(this.sideMenuService.option.pipe(skip(1)).subscribe(url => {
      this.goTo(url);
    }));

    this.subscription.add(CheckForUpdateService.NEW_VERSION.subscribe(_newVersion => {
      this.badge = {
        show: _newVersion,
        path: 'control'
      };
    }));
  }

  goTo(path: string) {
    this.router.goTo('/-/home/' + path);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
