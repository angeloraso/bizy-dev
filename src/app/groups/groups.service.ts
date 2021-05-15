import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@core/services';
import { STORAGE_KEYS } from '@core/services/storage.service';
import { IUser, SimpleUser } from '@users/model';
import { v4 as uuidv4 } from 'uuid';
import { IGroup } from './model';
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private readonly DEFAULT_GROUPS: Array<IGroup> = [
    {
      id: '39b3f132-70f8-4c2d-8d8c-8fe0ba96e0cf',
      name: 'Waiters',
      color: '#e63946',
      description: 'Waiters on the morning shift',
      users: [
        {
          id: 'd8231258-5358-4fd7-ba4b-2066e8efde77',
          name: 'Mary Streighford',
          picture: 'assets/img/female.svg'
        },
        {
          id: 'b2b7b485-f8c6-464b-ab5b-59e49bb6832b',
          name: 'Jhon Unicorn',
          picture: 'assets/img/unicorn.svg'
        }
      ],
      deleted: false
    },
    {
      id: '9d046829-007c-494a-9ea5-3ae5a70e0f91',
      name: 'Math Students',
      color: '#006d77',
      description: 'Monday and Friday, 10am',
      users: [
        {
          id: 'f4080091-5b41-4450-beb1-87cbec0ced5b',
          name: 'Arthur Conrad',
          picture: 'assets/img/male.svg'
        },
        {
          id: 'd8231258-5358-4fd7-ba4b-2066e8efde77',
          name: 'Mary Streighford',
          picture: 'assets/img/female.svg'
        }
      ],
      deleted: false
    },
    {
      id: 'd816ac0b-4247-4488-9820-33ccb733147c',
      name: 'This is a group with a really long name',
      color: '#5c6d70',
      description: 'This is a really long description to show what a group looks like',
      users: [
        {
          id: 'b2b7b485-f8c6-464b-ab5b-59e49bb6832b',
          name: 'Jhon Unicorn',
          picture: 'assets/img/unicorn.svg'
        }
      ],
      deleted: false
    }
  ];

  constructor(
    @Inject(StorageService) private storage: StorageService
  ) {
    this.setDefaultGroups();
  }

  async setDefaultGroups() {
    let groups = await this.storage.get(STORAGE_KEYS.GROUPS);
    if (groups) {
      return;
    }

    this.storage.set(STORAGE_KEYS.GROUPS, this.DEFAULT_GROUPS);
  }

  getGroups = (ids?: Array<string>, all: boolean = false) => {
    return new Promise<Array<IGroup>>(async resolve => {
      const groups: Array<IGroup> = await this.storage.get(STORAGE_KEYS.GROUPS);
      if (!groups) {
        resolve([]);
      } else {
        if (ids) {
          resolve(groups.filter(_group => ids.includes(_group.id)));
          return;
        }

        if (!all) {
          resolve(groups.filter(_group => !_group.deleted));
          return;
        }

        resolve(groups);
      }
    });
  }

  postGroup = (group: Omit<IGroup, 'id'>) => {
    return new Promise<IGroup>(async resolve => {
      let groups = await this.storage.get(STORAGE_KEYS.GROUPS);
      const newGroup: IGroup = {
        id: uuidv4(),
        name: group.name,
        color: group.color,
        description: group.description,
        users: [],
        deleted: false
      };
      if (!groups) {
        groups = [newGroup];
      } else {
        groups.push(newGroup);
      }

      await this.storage.set(STORAGE_KEYS.GROUPS, groups);
      resolve(newGroup);
    });
  }

  putGroup = (group: IGroup) => {
    return new Promise<{oldGroup: IGroup, newGroup: IGroup}>(async resolve => {
      const groups: Array<IGroup> = await this.storage.get(STORAGE_KEYS.GROUPS) ?? [];
      const index = groups.findIndex(_group => {
        return _group.id === group.id;
      });
      if (index !== -1) {
        const oldGroup = groups[index];
        const newGroup: IGroup = {
          id: group.id,
          name: group.name,
          color: group.color,
          description: group.description,
          users: group.users,
          deleted: group.deleted
        };
        groups[index] = newGroup;
        await this.storage.set(STORAGE_KEYS.GROUPS, groups);
        resolve({ oldGroup: oldGroup, newGroup: newGroup });
      }
    });
  }

  deleteGroups = (groupIds: Array<string>) => {
    return new Promise<void>(async resolve => {
      const groups: Array<IGroup> = await this.storage.get(STORAGE_KEYS.GROUPS) ?? [];
      groupIds.forEach(_id => {
        const index = groups.findIndex(_group => {
          return _group.id === _id;
        });
        if (index !== -1) {
          groups[index].users.length = 0;
          groups[index].deleted = true;
        }
      });
      await this.storage.set(STORAGE_KEYS.GROUPS, groups);
      resolve();
    });
  }

  addUserToGroups = (user: IUser) => {
    return new Promise<void>(async resolve => {
      const groups: Array<IGroup> = await this.storage.get(STORAGE_KEYS.GROUPS) ?? [];
      user.groups.forEach(_userGroup => {
        groups.forEach(_group => {
          if (_group.id === _userGroup.id) {
            _group.users.push(user);
          }
        });
      });

      await this.storage.set(STORAGE_KEYS.GROUPS, groups);
      resolve();
    });
  }

  updateUserFromGroups(user: SimpleUser) {
    return new Promise<void>(async resolve => {
      const groups: Array<IGroup> = await this.storage.get(STORAGE_KEYS.GROUPS) ?? [];
      groups.forEach(_group => {
        const index = _group.users.findIndex(_user => {
          return _user.id === user.id;
        });
        if (index !== -1) {
          const newUser = {
            id: user.id,
            name: user.name,
            picture: user.picture
          };
          _group.users[index] = newUser;
        }
      });

      await this.storage.set(STORAGE_KEYS.GROUPS, groups);
      resolve();
    });
  }

  removeUsersFromGroups(usersIds: Array<string>) {
    return new Promise<void>(async resolve => {
      const groups: Array<IGroup> = await this.storage.get(STORAGE_KEYS.GROUPS) ?? [];
      usersIds.forEach(_userId => {
        groups.forEach(_group => {
          const index = _group.users.findIndex(_user => {
            return _user.id === _userId;
          });
          if (index !== -1) {
            _group.users.splice(index, 1);
          }
        });
      });

      await this.storage.set(STORAGE_KEYS.GROUPS, groups);
      resolve();
    });
  }
}
