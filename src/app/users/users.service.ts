import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@core/services';
import { STORAGE_KEYS } from '@core/services/storage.service';
import { SimpleGroup } from '@groups/model';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from './model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly DEFAULT_USERS: Array<IUser> = [
    {
      id: 'b2b7b485-f8c6-464b-ab5b-59e49bb6832b',
      name: 'Jhon Unicorn',
      picture: 'assets/img/unicorn.svg',
      date: '1997-11-23T15:10:23.526-03:00',
      lastRecord: null,
      phones: [
        '12345567888'
      ],
      groups: [
        {
          id: '39b3f132-70f8-4c2d-8d8c-8fe0ba96e0cf',
          name: 'Waiters',
          color: '#e63946'
        }
      ],
      deleted: false
    },
    {
      id: 'd8231258-5358-4fd7-ba4b-2066e8efde77',
      name: 'Mary Streighford',
      picture: 'assets/img/female.svg',
      date: '1980-10-09T15:10:46.806-03:00',
      lastRecord: null,
      phones: [
        '32443241'
      ],
      groups: [
        {
          id: '9d046829-007c-494a-9ea5-3ae5a70e0f91',
          name: 'Math Students',
          color: '#006d77'
        },
        {
          id: '39b3f132-70f8-4c2d-8d8c-8fe0ba96e0cf',
          name: 'Waiters',
          color: '#e63946'
        }
      ],
      deleted: false
    },
    {
      id: 'f4080091-5b41-4450-beb1-87cbec0ced5b',
      name: 'Arthur Conrad',
      picture: 'assets/img/male.svg',
      date: '1962-03-15T15:11:46.064-03:00',
      lastRecord: null,
      phones: [
        '52351534141'
      ],
      groups: [
        {
          id: '9d046829-007c-494a-9ea5-3ae5a70e0f91',
          name: 'Math Students',
          color: '#006d77'
        }
      ],
      deleted: false
    }
  ];

  constructor(
    @Inject(StorageService) private storage: StorageService
  ) {
    this.setDefaultUsers();
  }

  async setDefaultUsers() {
    let users = await this.storage.get(STORAGE_KEYS.USERS);
    if (users) {
      return;
    }

    this.storage.set(STORAGE_KEYS.USERS, this.DEFAULT_USERS);
  }

  getUsers = (ids?: Array<string>, all: boolean = false) => {
    return new Promise<Array<IUser>>(async resolve => {
      const users: Array<IUser> = await this.storage.get(STORAGE_KEYS.USERS);
      if (!users) {
        resolve([]);
      } else {
        if (ids) {
          resolve(users.filter(_user => ids.includes(_user.id)));
          return;
        }

        if (!all) {
          resolve(users.filter(_user => !_user.deleted));
          return;
        }

        resolve(users);
      }
    });
  }

  postUser = (user: Omit<IUser, 'id'>) => {
    return new Promise<IUser>(async resolve => {
      let users = await this.storage.get(STORAGE_KEYS.USERS);
      const newUser: IUser = {
        id: uuidv4(),
        name: user.name,
        picture: user.picture,
        date: user.date,
        lastRecord: null,
        phones: user.phones,
        groups: user.groups,
        deleted: false
      };
      if (!users) {
        users = [newUser];
      } else {
        users.push(newUser);
      }

      await this.storage.set(STORAGE_KEYS.USERS, users);
      resolve(newUser);
    });
  }

  putUser = (user: IUser) => {
    return new Promise<{oldUser: IUser, newUser: IUser}>(async resolve => {
      const users: Array<IUser> = await this.storage.get(STORAGE_KEYS.USERS) ?? [];
      const index = users.findIndex(_user => {
        return _user.id === user.id;
      });
      if (index !== -1) {
        const oldUser = users[index];
        const newUser = {
          id: user.id,
          name: user.name,
          picture: user.picture,
          date: user.date,
          lastRecord: user.lastRecord,
          phones: user.phones,
          groups: user.groups,
          deleted: user.deleted
        };
        users[index] = newUser;
        await this.storage.set(STORAGE_KEYS.USERS, users);
        resolve({ oldUser: oldUser, newUser: newUser });
      }
    });
  }

  deleteUsers(ids: Array<string>) {
    return new Promise<void>(async resolve => {
      const users: Array<IUser> = await this.storage.get(STORAGE_KEYS.USERS) ?? [];
      ids.forEach(_id => {
        const index = users.findIndex(_user => {
          return _user.id === _id;
        });
        if (index !== -1) {
          users[index].groups.length = 0;
          users[index].deleted = true;
        }
      });

      await this.storage.set(STORAGE_KEYS.USERS, users);
      resolve();
    });
  }

  updateGroupFromUsers(group: SimpleGroup) {
    return new Promise<void>(async resolve => {
      const users: Array<IUser> = await this.storage.get(STORAGE_KEYS.USERS) ?? [];
      users.forEach(_user => {
        const index = _user.groups.findIndex(_group => {
          return _group.id === group.id;
        });
        if (index !== -1) {
          const newGroup: SimpleGroup = {
            id: group.id,
            name: group.name,
            color: group.color
          };
          _user.groups[index] = newGroup;
        }
      });

      await this.storage.set(STORAGE_KEYS.USERS, users);
      resolve();
    });
  }

  removeGroupsFromUsers(groupIds: Array<string>) {
    return new Promise<void>(async resolve => {
      const users: Array<IUser> = await this.storage.get(STORAGE_KEYS.USERS) ?? [];
      groupIds.forEach(_id => {
        users.forEach(_user => {
          const index = _user.groups.findIndex(_group => {
            return _group.id === _id;
          });
          if (index !== -1) {
            _user.groups.splice(index, 1);
          }
        });
      });

      await this.storage.set(STORAGE_KEYS.USERS, users);
      resolve();
    });
  }
}
