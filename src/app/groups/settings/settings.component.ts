import { Component, Inject } from '@angular/core';
import { GENERAL_GROUP } from '@core/constants';
import { CacheService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { IGroup } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.scss'],
  providers: [RouterService]
})
export class SettingsComponent {
  title: string;
  editMode: boolean;
  fakeGroup: Omit<IGroup, 'id' | 'deleted'>;
  group: Omit<IGroup, 'id' | 'deleted'> = {
    name: '',
    color: GENERAL_GROUP.color,
    description: '',
    users: []
  };

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(RouterService) private router: RouterService,
    @Inject(AppService) private appService: AppService,
    @Inject(ToastService) private toastService: ToastService,
    @Inject(AlertController) private alertController: AlertController,
    @Inject(CacheService) private cache: CacheService
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.hide();
    const groupId = this.router.getId('groupId');
    if (groupId) {
      this.editMode = true;
      this.title = 'Settings';
      const groups = this.cache.getData(CACHE_KEYS.GROUPS);
      if (groups.length > 0) {
        this.group = groups[0];
        this.initFakeGroup();
      } else {
        this.appService.getGroups([groupId!]).then(groups => {
          this.group = groups[0];
          this.initFakeGroup();
          this.saveCache();
        });
      }
    } else {
      this.editMode = false;
      this.title = 'Create group';
      this.initFakeGroup();
      this.saveCache();
    }
  }

  initFakeGroup() {
    if (this.editMode) {
      this.fakeGroup = this.group;
    } else {
      this.fakeGroup = {
        name: 'Nombre grupo',
        color: this.group.color,
        description: this.group.description,
        users: []
      };
    }
  }

  goBack() {
    this.clearCache();
    this.router.goBack();
  }

  save() {
    if (!this.group.name) {
      this.toastService.warning('The name is required');
      return;
    }

    if (!this.group.color) {
      this.toastService.warning('The color is required');
      return;
    }

    if (this.editMode) {
      this.appService.editGroup(this.group as IGroup).then(() => {
        this.toastService.success('Group was edited');
        this.clearCache();
        this.goBack();
      });
    } else {
      this.appService.createGroup(this.group as IGroup).then(() => {
        this.toastService.success('Group was created');
        this.clearCache();
        this.goBack();
      });
    }
  }

  async showDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete group',
      message: 'The group ' + this.group.name + 'will be deleted. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteGroup();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteGroup = () => {
    this.appService.deleteGroup((this.group as IGroup).id).then(() => {
      this.router.goTo('../../home/groups');
      this.toastService.success('Group was deleted!');
      this.clearCache();
    });
  }

  saveCache() {
    this.cache.setData(CACHE_KEYS.GROUPS, [this.group]);
  }

  clearCache() {
    this.cache.clear(CACHE_KEYS.GROUPS);
  }
}
