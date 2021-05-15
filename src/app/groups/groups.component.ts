import { Component, Inject } from '@angular/core';
import { ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { IGroup } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'groups',
  templateUrl: 'groups.html',
  styleUrls: ['groups.scss'],
  providers: [RouterService]
})
export class GroupsComponent {
  groups: Array<IGroup>;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(ActionSheetController) private actionSheetController: ActionSheetController,
    @Inject(ToastService) public toastService: ToastService,
    @Inject(RouterService) private router: RouterService,
    @Inject(AlertController) private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.show();
    this.appService.getGroups().then(_groups => {
      this.groups = _groups;
    });
  }

  async showGroupOptions(group: IGroup) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.showDeleteAlert(group);
        }
      },
      {
        text: 'Edit',
        icon: 'create-outline',
        handler: () => {
          this.editGroup(group);
        }
      },
      {
        text: 'Open',
        icon: 'eye-outline',
        handler: () => {
          this.goToGroup(group);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  goToGroup(group: IGroup) {
    this.router.goTo(group.id, { [CACHE_KEYS.GROUPS]: [group] } as {[key in CACHE_KEYS]: any});
  }

  editGroup(group: IGroup) {
    this.router.goTo(group.id + '/settings', { [CACHE_KEYS.GROUPS]: [group] } as {[key in CACHE_KEYS]: any});
  }

  async createGroup() {
    this.router.goTo('new');
  }

  async showDeleteAlert(group: IGroup) {
    const alert = await this.alertController.create({
      header: 'Delete group',
      message: 'The group ' + group.name + 'will be deleted. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteGroup(group);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteGroup(group: IGroup) {
    this.appService.deleteGroup(group.id).then(() => {
      const index = this.groups.findIndex(_group => {
        return _group.id === group.id;
      });
      this.groups.splice(index, 1);
      this.toastService.success('Group was deleted!');
    });
  }
}
