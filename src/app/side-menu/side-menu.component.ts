import { Component, Inject } from '@angular/core';
import { MENU_OPTIONS } from '@core/constants';
import { CheckForUpdateService, RouterService } from '@core/services';
import { Subscription } from 'rxjs';
import { SideMenuService } from './side-menu.service';

@Component({
  selector: 'aup-side-menu',
  templateUrl: './side-menu.html',
  styleUrls: ['./side-menu.scss'],
  providers: [RouterService]
})
export class SideMenuComponent {
  options: Array<any> = MENU_OPTIONS;
  badge: {show: boolean, path: string};
  private subscription = new Subscription();

  constructor(
    @Inject(SideMenuService) private sideMenuService: SideMenuService,
    @Inject(RouterService) private router: RouterService
  ) {}

  ionViewWillEnter() {
    const url = this.router.getURL();
    this.options.forEach(_option => {
      _option.active = url.indexOf(`-/home/${_option.path}`) !== -1;
    });

    this.subscription.add(CheckForUpdateService.NEW_VERSION.subscribe(_newVersion => {
      this.badge = {
        show: _newVersion,
        path: 'control'
      };
    }));
  }

  menuChageVisibility(event: any) {
    this.sideMenuService.setOpen(event.detail.visible);
  }

  showOption(option: any) {
    this.options.forEach(option => {
      option.active = false;
    });
    option.active = true;

    this.sideMenuService.setOption(option.path);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
