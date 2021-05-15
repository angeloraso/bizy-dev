import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IUser } from '@users/model';
import { AppService } from 'src/app/app.service';
import { UsersModalComponent } from './user-picker.component';

@Injectable()
export class UserPickerService {
  constructor(
    @Inject(ModalController) private modalController: ModalController,
    @Inject(AppService) private appService: AppService
  ) {}

  async show(hideGroupId: string) {
    return new Promise<IUser>(async (resolve, reject) => {
      let users = await this.appService.getUsers();
      users = users.filter(_user => {
        let userInGroup: boolean = false;
        for (let i = 0; i < _user.groups.length; i++) {
          if (_user.groups[i].id === hideGroupId) {
            userInGroup = true;
            break;
          }
        }

        return !userInGroup;
      });
      const modal = await this.modalController.create({
        component: UsersModalComponent,
        componentProps: {
          user: null,
          users: users
        }
      });

      modal.present();

      modal.onWillDismiss().then(res => {
        if (res.data) {
          resolve(res.data as IUser);
          return;
        }

        reject();
      });
    });
  }
}
