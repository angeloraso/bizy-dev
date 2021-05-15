import { Component, Inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { RouterService } from '@core/services';
import { CheckForUpdateService } from '@core/services/check-for-updates.service';
import { BottomBarService } from '@home/bottomBar.service';
import { distinct } from 'rxjs/operators';

@Component({
  selector: 'control',
  templateUrl: 'control.html',
  styleUrls: ['control.scss'],
  providers: [RouterService]
})
export class ControlComponent {
  newVersion: boolean = false;
  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(RouterService) private routerService: RouterService
  ) {
    // Subscribes for updates
    CheckForUpdateService.NEW_VERSION.pipe(distinct()).subscribe(_newVersion => {
      this.newVersion = _newVersion;
    });
  }

  ionViewWillEnter() {
    this.bottomBarService.show();
  }

  update() {
    window.location.reload();
  }

  logout() {
    this.authService.logout().then(() => {
      this.routerService.goTo('/auth');
    });
  }
}
