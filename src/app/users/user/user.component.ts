import { Component, Inject, ViewChild } from '@angular/core';
import { CacheService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { IGroup } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { AlertController, IonSelect, PopoverController } from '@ionic/angular';
import { IUser } from '@users/model';
import { SelectImgComponent } from '@users/select-img/select-img.component';
import { AppService } from 'src/app/app.service';

const COMPARE_WITH = (group1: IGroup, group2: IGroup | Array<IGroup>) => {
  if (Array.isArray(group2)) {
    if (!group1 || !group1.id) {
      return false;
    }

    return group2.find(val => val && val.id === group1.id);
  }

  return group1 && group2 ? group1.id === group2.id : group1 === group2;
};

@Component({
  selector: 'user',
  templateUrl: 'user.html',
  styleUrls: ['user.scss'],
  providers: [RouterService]
})
export class UserComponent {
  @ViewChild('groupSelect') groupSelect: IonSelect;
  title: string = 'Create user';
  confirmText: string = 'Create';
  user: Partial<IUser>;
  groups: Array<IGroup>;
  editMode: boolean;
  newPhone: string;
  age: string;
  compareWith = COMPARE_WITH;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(RouterService) private router: RouterService,
    @Inject(ToastService) private toastService: ToastService,
    @Inject(AppService) private appService: AppService,
    @Inject(CacheService) private cache: CacheService,
    @Inject(PopoverController) public popoverController: PopoverController,
    @Inject(AlertController) private alertController: AlertController
  ) {
  }

  async ionViewWillEnter() {
    this.bottomBarService.hide();

    const userId = this.router.getId('userId');
    if (userId) {
      this.editMode = true;
      this.title = 'Edit user';
      this.confirmText = 'Edit';
    }

    this.groups = this.cache.getData(CACHE_KEYS.GROUPS);
    if (this.groups.length === 0) {
      this.groups = await this.appService.getGroups();
    }

    let users = this.cache.getData(CACHE_KEYS.USERS);
    if (users.length > 0) {
      this.user = users[0];
    } else if (userId) {
      users = await this.appService.getUsers([userId]);
      if (users.length > 0) {
        this.user = users[0];
      }
    }

    if (!this.user) {
      this.initUserForm();
    }

    const groupId = this.router.getId('groupId');

    if (this.user.groups?.length === 0 && groupId) {
      const group = this.groups.find(_group => {
        return _group.id === groupId;
      });
      if (group) {
        this.user.groups = [group];
      }
    }

    if (this.user.date) {
      this.setAge(this.user.date);
    }

    this.cache.setData(CACHE_KEYS.USERS, [this.user]);
    this.cache.setData(CACHE_KEYS.GROUPS, this.groups);
  }

  initUserForm() {
    this.user = {
      picture: 'assets/img/unicorn.svg',
      phones: [],
      groups: []
    };
  }

  async selectImg(ev: Event) {
    const popover = await this.popoverController.create({
      component: SelectImgComponent,
      event: ev
    });
    popover.onDidDismiss().then(res => {
      if (res.data) {
        this.user.picture = res.data;
        this.cache.setData(CACHE_KEYS.USERS, [this.user]);
      }
    });

    return popover.present();
  }

  addPhoneInput() {
    if (!this.newPhone) {
      return;
    }

    this.user.phones?.push(this.newPhone);
    this.newPhone = '';
  }

  setAge(dateString: string) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.age = String(age);
  }

  async showDeleteAlert() {
    if (!this.editMode) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Delete user',
      message: 'The user will be deleted. Do you agree?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteUser();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteUser() {
    if (this.user.id) {
      this.appService.deleteUser(this.user.id).then(() => {
        this.toastService.success('User deleted!');
        this.goBack();
      });
    }
  }

  openGroupSelect() {
    this.groupSelect.open();
  }

  goBack() {
    this.router.goBack();
  }

  save() {
    if (!this.user.name) {
      this.toastService.warning('There must be a name');
      return;
    }

    if (this.user.phones?.length === 0 && !this.newPhone) {
      this.toastService.warning('There must be a contact telephone number');
      return;
    }

    // Remove empty phones
    this.user.phones = this.user?.phones?.filter(_phone => {
      return Boolean(_phone) !== false;
    });

    if (this.newPhone) {
      this.user.phones?.push(this.newPhone);
    }

    if (this.editMode) {
      this.appService.editUser(this.user as IUser).then(() => {
        this.toastService.success('Changes saved!');
        this.goBack();
      });
    } else {
      this.appService.createUser(this.user as IUser).then(() => {
        this.toastService.success('User created!');
        this.goBack();
      });
    }
  }

  saveCache() {
    this.cache.setData(CACHE_KEYS.USERS, [this.user]);
  }

  ionViewWillLeave() {
    this.cache.clear(CACHE_KEYS.USERS);
    this.cache.clear(CACHE_KEYS.GROUPS);
  }
}
