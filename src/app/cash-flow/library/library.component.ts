import { Component, Inject } from '@angular/core';
import { ILibraryRecord } from '@cash-flow/model';
import { RouterService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { BottomBarService } from '@home/bottomBar.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'library',
  templateUrl: 'library.html',
  styleUrls: ['library.scss'],
  providers: [RouterService]
})
export class LibraryComponent {
  library: Array<ILibraryRecord> = [];
  search: string;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(ActionSheetController) private actionSheetController: ActionSheetController,
    @Inject(ToastService) public toastService: ToastService,
    @Inject(AlertController) private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.hide();

    this.appService.getLibrary().then(_library => {
      this.library = _library;
    });
  }

  async showLibraryRecordOptions(record: ILibraryRecord) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.showDeleteAlert(record);
        }
      },
      {
        text: 'Edit',
        icon: 'create-outline',
        handler: () => {
          this.editLibraryRecord(record);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }

  selectRecord(record: ILibraryRecord) {
    if (this.router.getURL().indexOf('cash-flow/library') === -1) {
      this.router.goBack({ [CACHE_KEYS.CASH_FLOW_RECORDS]: [record] } as {[key in CACHE_KEYS]: any});
      return;
    }

    this.editLibraryRecord(record);
  }

  async showDeleteAlert(record: ILibraryRecord) {
    const alert = await this.alertController.create({
      header: 'Delete record',
      message: 'The record will be deleted. Do you agree?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteRecord(record.id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteRecord(recordId: string) {
    this.appService.deleteLibraryRecord(recordId).then(_library => {
      const index = this.library.findIndex(_record => {
        return _record.id === recordId;
      });
      this.library.splice(index, 1);
      // Force change detection
      this.library = [...this.library];
      this.toastService.success('Record was deleted!');
    });
  }

  goBack() {
    this.router.goBack();
  }

  editLibraryRecord(record: ILibraryRecord) {
    this.router.goTo(record.id, { [CACHE_KEYS.LIBRARY_RECORDS]: [record] } as {[key in CACHE_KEYS]: Array<any>});
  }

  createLibraryRecord() {
    this.router.goTo('new');
  }
}
