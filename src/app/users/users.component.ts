import { Component, Inject } from '@angular/core';
import { GENERAL_GROUP } from '@core/constants';
import { ToastService } from '@core/services';
import { CacheService, CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { IGroup } from '@groups/model';
import { BottomBarService } from '@home/bottomBar.service';
import { PopoverController } from '@ionic/angular';
import { UserPickerService } from '@shared/components/user-picker/user-picker.service';
import { IUser } from '@users/model';
import { AppService } from 'src/app/app.service';
import { UserActionType } from './user-card/user-card.component';
@Component({
  selector: 'users',
  templateUrl: 'users.html',
  styleUrls: ['users.scss'],
  providers: [RouterService]
})
export class UsersComponent {
  users: Array<IUser> = [];
  search: string = '';
  groupMode: boolean = false;
  title: string;
  group: IGroup;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(RouterService) private router: RouterService,
    @Inject(AppService) private appService: AppService,
    @Inject(CacheService) private cache: CacheService,
    @Inject(PopoverController) private popoverController: PopoverController,
    @Inject(UserPickerService) private userPickerService: UserPickerService,
    @Inject(ToastService) private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    const groupId = this.router.getId('groupId');
    if (groupId) {
      this.bottomBarService.hide();
      this.title = 'Members';
      this.groupMode = true;
      this.users = this.cache.getData(CACHE_KEYS.USERS);
      if (this.users.length === 0) {
        this.appService.getGroupUsers(groupId).then(_users => {
          const currentMonth: number = new Date().getMonth();
          _users.forEach(_user => {
            if (_user.lastRecord) {
              const lastRecordDate = new Date(_user.lastRecord.date);
              const lastRecordGroupId = _user.lastRecord.group.id;
              const isIncome = (_user.lastRecord.amount > 0);
              // @ts-ignore
              _user.noDebt = (lastRecordDate.getMonth() === currentMonth) && (lastRecordGroupId === groupId) && isIncome;
            }
          });
          this.users = _users;
          this.cache.setData(CACHE_KEYS.USERS, this.users);
        });
      }

      const groups = this.cache.getData(CACHE_KEYS.GROUPS);
      if (groups.length === 0) {
        this.appService.getGroups([groupId]).then(_groups => {
          this.group = _groups[0];
          this.cache.setData(CACHE_KEYS.GROUPS, [this.group]);
        });
      } else {
        this.group = groups[0];
      }
    } else {
      this.bottomBarService.show();
      this.title = 'Users';
      this.users = this.cache.getData(CACHE_KEYS.USERS);
      if (this.users.length === 0) {
        this.appService.getUsers().then(_users => {
          this.users = _users;
          this.cache.setData(CACHE_KEYS.USERS, this.users);
        });
      }
    }
  }

  editUser(user: IUser) {
    this.router.goTo(user.id, { [CACHE_KEYS.USERS]: [user] } as {[key in CACHE_KEYS]: any});
  }

  async addUser(event: any) {
    if (!this.group) {
      this.createUser();
      return;
    }

    const popover = await this.popoverController.create({
      component: AddUserPopover,
      event: event,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then(res => {
      if (res?.data === 'new') {
        this.createUser();
        return;
      }

      if (res?.data === 'add') {
        this.userPickerService.show(this.group.id).then(_user => {
          _user.groups.push(this.group);
          this.appService.editUser(_user).then(() => {
            this.users.push(_user);
            this.users = [...this.users];
            this.toastService.success('User was added');
          });
        }).catch(() => {});
      }
    });
  }

  createUser() {
    this.router.goTo('new');
  }

  userAction(action: UserActionType, user: any) {
    if (action === 'record') {
      this.addRecord(user);
    }
  }

  addRecord(user: IUser) {
    if (!this.group) {
      this.group = GENERAL_GROUP;
    }

    const record = {
      group: this.group,
      user: user
    };

    this.router.goTo(`${user.id}/cash-flow/new`, { [CACHE_KEYS.CASH_FLOW_RECORDS]: [record] } as {[key in CACHE_KEYS]: any});
  }

  ionViewWillLeave() {
    this.cache.clear(CACHE_KEYS.USERS);
    this.cache.clear(CACHE_KEYS.GROUPS);
  }
}

@Component({
  selector: 'add-user',
  template: `
    <ion-list>
      <ion-list-header>Add member</ion-list-header>
      <ion-item button (click)="popoverController.dismiss('new')">New</ion-item>
      <ion-item button (click)="popoverController.dismiss('add')">From user list</ion-item>
    </ion-list>
  `
})
export class AddUserPopover {
  constructor(
    @Inject(PopoverController) public popoverController: PopoverController
  ) {}
}
