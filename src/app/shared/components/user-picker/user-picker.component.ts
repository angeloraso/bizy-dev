import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GENERAL_GROUP } from '@core/constants';
import { SimpleGroup } from '@groups/model';
import { ModalController } from '@ionic/angular';
import { IUser, SimpleUser } from '@users/model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'user-picker',
  templateUrl: 'user-picker.html',
  styleUrls: ['user-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPickerComponent implements OnChanges {
  @Input() user: SimpleGroup | undefined;
  @Input() group: SimpleGroup;
  @Input() disabled: boolean = false;
  @Output() userChange = new EventEmitter<SimpleUser>();

  private users: Array<IUser>;

  constructor(
    @Inject(ModalController) private modalController: ModalController,
    @Inject(AppService) private appService: AppService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.group?.currentValue && !changes.user?.currentValue) {
      if (changes.group.currentValue && changes.group.currentValue.id !== GENERAL_GROUP.id) {
        this.user = undefined;
        this.disabled = false;
        this.appService.getGroupUsers(changes.group.currentValue.id).then(_users => {
          this.users = _users;
        });
        return;
      }

      if (changes.group.currentValue.id === GENERAL_GROUP.id) {
        this.user = undefined;
        this.disabled = true;
        return;
      }

      if (changes.group.currentValue.id !== GENERAL_GROUP.id) {
        this.disabled = false;
        this.appService.getUsers().then(_users => {
          this.users = _users;
        });
      }
    }

    if (changes.user?.currentValue) {
      this.disabled = false;
    }
  }

  async showUsers() {
    if (this.disabled) {
      return;
    }

    const modal = await this.modalController.create({
      component: UsersModalComponent,
      componentProps: {
        user: this.user,
        users: this.users
      }
    });

    modal.onWillDismiss().then(res => {
      if (res.data) {
        this.user = res.data;
        this.userChange.emit(res.data);
      }
    });

    return modal.present();
  }
}

@Component({
  selector: 'users-modal',
  templateUrl: 'users-modal.html',
  styleUrls: ['user-picker.scss']
})
export class UsersModalComponent {
  @Input() user: SimpleGroup | undefined;
  @Input() users: Array<IUser> = [];

  selectableUsers: Array<IUser & {active: boolean}> = [];
  search: string;

  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    this.users.forEach(_user => {
      if (_user.id === this.user?.id) {
        this.selectableUsers.push(Object.assign({}, _user, { active: true }));
      } else {
        this.selectableUsers.push(Object.assign({}, _user, { active: false }));
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  selectUser(user: SimpleUser) {
    this.modalController.dismiss(user);
  }
}
