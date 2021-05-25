import { Inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, interval } from 'rxjs';
import { LogService } from './log.service';

@Injectable()
export class CheckForUpdateService {
    static NEW_VERSION = new BehaviorSubject<boolean>(false);

    constructor(
    @Inject(SwUpdate) private swUpdate: SwUpdate,
    @Inject(LogService) private logService: LogService,
    @Inject(ToastController) private toastController: ToastController
    ) {}

    init() {
      // Check for update every hour
      const everyOneHour = interval(1 * 60 * 60 * 1000);
      everyOneHour.subscribe(() => {
        this.swUpdate.checkForUpdate().then(() => {
          this.logService.info('Check for update done');
        });
      });

      // Subscribes for updates
      this.swUpdate.available.subscribe(() => {
        this.logService.info('New version available');
        CheckForUpdateService.NEW_VERSION.next(true);
        this.newVersionToast();
      });
    }

    async newVersionToast() {
      const toast = await this.toastController.create({
        header: 'New version!',
        message: 'There is a new version available. Do you want to activate it now?',
        position: 'bottom',
        cssClass: 'toast--new-version',
        buttons: [
          {
            role: 'cancel',
            text: 'Later',
            handler: () => {
              this.logService.info('New version rejected');
            }
          }, {
            side: 'end',
            icon: 'rocket',
            text: 'Update',
            handler: () => {
              window.location.reload();
            }
          }
        ]
      });
      toast.present();
    }
}
