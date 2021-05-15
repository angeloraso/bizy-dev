import { Component, Inject, Input, ViewChild } from '@angular/core';
import { ICashFlowRecord, ICategory, ILibraryRecord } from '@cash-flow/model';
import { CacheService, RouterService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'cash-flow-record',
  templateUrl: 'cash-flow-record.html',
  styleUrls: ['cash-flow-record.scss'],
  providers: [RouterService]
})
export class CashFlowRecordComponent {
  @ViewChild('amountInput') amountInput: any;
  @Input() title = 'Crear registro';
  private CACHE_KEY = CACHE_KEYS.CASH_FLOW_RECORDS;
  isLibraryRecord: boolean = false;
  isExpense: boolean;
  categories: Array<ICategory> = [];
  amount: number | null;
  editMode: boolean;
  record: Partial<ICashFlowRecord & ILibraryRecord>;
  saveIsAvailable: boolean = false;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(ToastService) public toastService: ToastService,
    @Inject(AlertController) private alertController: AlertController,
    @Inject(CacheService) private cache: CacheService
  ) {
    this.initRecordForm();
  }

  async ionViewWillEnter() {
    this.bottomBarService.hide();
    this.isLibraryRecord = this.router.getURL().indexOf('library') !== -1;
    if (this.isLibraryRecord) {
      this.CACHE_KEY = CACHE_KEYS.LIBRARY_RECORDS;
    }

    this.initRecordForm();

    const recordId = this.router.getId('recordId');
    const libraryRecordId = this.router.getId('libraryRecordId');
    if ((recordId && !this.isLibraryRecord) || libraryRecordId) {
      this.editMode = true;
    }

    const records = this.cache.getData(this.CACHE_KEY);
    const categories = this.cache.getData(CACHE_KEYS.CATEGORIES);

    if (records.length > 0) {
      // If record comes from library, must having a name
      if (records[0].name) {
        // Overwrite librery record id and date properties
        records[0].id = this.record.id;
        records[0].date = this.record.date;
      }

      this.record = Object.assign(this.record, records[0]);
    } else if (recordId && !this.isLibraryRecord) {
      this.record = (await this.appService.getRecords([recordId]))[0];
    } else if (libraryRecordId) {
      this.record = (await this.appService.getRecords([libraryRecordId]))[0];
    }

    const groupId = this.router.getId('groupId');
    if (groupId) {
      this.isExpense = false;
      if (!this.record.group) {
        this.record.group = {
          id: groupId,
          name: '',
          color: ''
        };
      }
    }

    if (categories.length > 0) {
      this.record.category = categories[0];
    }

    if (this.record.amount) {
      this.isExpense = this.record.amount < 0;
      this.amount = Math.abs(this.record.amount);
    }

    this.saveIsAvailable = true;
    this.saveCache();

    // Set focus to amount input if it is empty
    if (!this.amount) {
      this.amountInput.nativeElement.focus();
    }
  }

  initRecordForm() {
    this.record = {
      date: new Date().toString(),
      payment: 'cash'
    };
    this.isExpense = true;
    this.editMode = false;
    this.amount = null;
  }

  onToggle() {
    if (this.record.amount) {
      this.record.amount *= -1;
      this.cache.setData(this.CACHE_KEY, [this.record]);
    }
  }

  setAmount(amount: number) {
    if (!amount) {
      this.amount = null;
      this.record.amount = 0;
    } else {
      this.amount = Math.abs(amount);
      this.record.amount = Math.abs(amount);
      if (this.isExpense) {
        this.record.amount *= -1;
      }
    }

    this.cache.setData(this.CACHE_KEY, [this.record]);
  }

  goBack() {
    this.clearCache();
    this.router.goBack();
  }

  goTo(route: string) {
    this.router.goTo(route);
  }

  save() {
    if (!this.record.amount) {
      this.toastService.warning('The amount is mandatory');
      return;
    }

    if (!this.record.category) {
      this.toastService.warning('Category is required');
      return;
    }

    if (this.isLibraryRecord && !this.record.name) {
      this.toastService.warning('The name is required');
      return;
    }

    if (this.isLibraryRecord) {
      this.saveLibraryRecord(this.record as ILibraryRecord);
    } else {
      this.saveCashFlowRecord(this.record as ICashFlowRecord);
    }
  }

  saveLibraryRecord(record: ILibraryRecord) {
    if (this.editMode) {
      this.appService.editLibraryRecord(record).then(() => {
        this.goBack();
      });
    } else {
      this.appService.createLibraryRecord(record).then(() => {
        this.goBack();
      });
    }
  }

  saveCashFlowRecord(record: ICashFlowRecord) {
    if (this.editMode) {
      this.appService.editRecord(record).then(() => {
        this.goBack();
      });
    } else {
      this.appService.createRecord(record).then(() => {
        this.goBack();
      });
    }
  }

  async showDeleteAlert() {
    if (!this.editMode) {
      return;
    }

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
            this.deleteRecord();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteRecord() {
    if (this.record.id) {
      if (this.isLibraryRecord) {
        this.appService.deleteLibraryRecord(this.record.id).then(() => {
          this.toastService.success('The record was deleted from the library!');
          this.goBack();
        });
      } else {
        this.appService.deleteRecord(this.record.id).then(() => {
          this.toastService.success('The record was deleted!');
          this.goBack();
        });
      }
    }
  }

  saveCache() {
    if (!this.saveIsAvailable) {
      return;
    }

    this.cache.setData(this.CACHE_KEY, [this.record]);
  }

  clearCache() {
    this.cache.clear(this.CACHE_KEY);
    this.cache.clear(CACHE_KEYS.CATEGORIES);
  }
}
