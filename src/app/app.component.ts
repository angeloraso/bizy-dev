import { Component, HostListener, Inject } from '@angular/core';
import { ToastService } from '@core/services';
import { CheckForUpdateService } from '@core/services/check-for-updates.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class AppComponent {
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    // Prevent Chrome 67 and earlier from automatically showing the automatic "Add to home screen" banner
    e.preventDefault();
  }

  @HostListener('window:appinstalled', ['$event'])
  async appinstalled() {
    setTimeout(() => {
      this.toastService.success('App installed! Check your main screen');
    }, 2000);
  }

  constructor(
    @Inject(Platform) private platform: Platform,
    @Inject(SplashScreen) private splashScreen: SplashScreen,
    @Inject(StatusBar) private statusBar: StatusBar,
    @Inject(ToastService) private toastService: ToastService,
    @Inject(CheckForUpdateService) private checkForUpdateService: CheckForUpdateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Service worker is not activated for electron
      if (!this.platform.is('electron')) {
        this.checkForUpdateService.init();
      }

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
