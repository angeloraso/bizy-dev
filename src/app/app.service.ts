import { Inject, Injectable } from '@angular/core';
import { CashFlowService } from '@cash-flow/cash-flow.service';
import { CategoriesService } from '@cash-flow/categories/categories.service';
import { LibraryService } from '@cash-flow/library/library.service';
import { ICashFlowRecord, ICategory, ILibraryRecord } from '@cash-flow/model';
import { GroupsService } from '@groups/groups.service';
import { IAttendanceSheet, IGroup } from '@groups/model';
import { IUser } from '@users/model';
import { UsersService } from '@users/users.service';
import { AttendanceService } from './groups/attendance/attendance.service';
import { IAttendanceEvent } from './groups/model';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(GroupsService) private groupsService: GroupsService,
    @Inject(CashFlowService) private cashFlowService: CashFlowService,
    @Inject(CategoriesService) private categoriesService: CategoriesService,
    @Inject(LibraryService) private libraryService: LibraryService,
    @Inject(AttendanceService) private attendanceService: AttendanceService
  ) {}

  getGroups = (ids?: Array<string>, all: boolean = false) => {
    return new Promise<Array<IGroup>>(async resolve => {
      const groups = await this.groupsService.getGroups(ids, all);
      resolve(groups);
    });
  }

  createGroup = (group: Omit<IGroup, 'id'>) => {
    return new Promise<IGroup>(async resolve => {
      const newGroup = await this.groupsService.postGroup(group);
      resolve(newGroup);
    });
  }

  editGroup = (group: IGroup) => {
    return new Promise<void>(async resolve => {
      const res = await this.groupsService.putGroup(group);
      if (this.simpleGroupWasEdited(res.oldGroup, res.newGroup)) {
        Promise.all([
          this.usersService.updateGroupFromUsers(res.newGroup),
          this.cashFlowService.updateGroupFromRecords(res.newGroup)
        ]).then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  deleteGroup = (id: string) => {
    return new Promise<void>(resolve => {
      Promise.all([
        this.groupsService.deleteGroups([id]),
        this.usersService.removeGroupsFromUsers([id]),
        this.libraryService.removeGroupsFromLibrary([id])
      ]).then(() => {
        resolve();
      });
    });
  }

  simpleGroupWasEdited(oldGroup: IGroup, newGroup: IGroup): boolean {
    return (oldGroup.name !== newGroup.name || oldGroup.color !== newGroup.color);
  }

  getGroupUsers = (groupId: string) => {
    return new Promise<Array<IUser>>(async resolve => {
      let users = await this.usersService.getUsers();
      users = users.filter(_user => {
        const index = _user.groups.findIndex(_group => {
          return _group.id === groupId;
        });
        return index !== -1;
      });
      resolve(users);
    });
  }

  getGroupAttendanceSheets = (groupId: string) => {
    return new Promise<Array<IAttendanceSheet>>(async resolve => {
      let attendanceSheets = await this.attendanceService.getAttendanceSheets();
      attendanceSheets = attendanceSheets.filter(_attendanceSheet => {
        return _attendanceSheet.group.id === groupId;
      });
      resolve(attendanceSheets);
    });
  }

  getGroupRecords = (groupId: string) => {
    return new Promise<Array<ICashFlowRecord>>(async resolve => {
      let records = await this.cashFlowService.getRecords();
      records = records.filter(_record => {
        return _record.group.id === groupId;
      });
      resolve(records);
    });
  }

  getUsers = (ids?: Array<string>, all: boolean = false) => {
    return new Promise<Array<IUser>>(async resolve => {
      const users = await this.usersService.getUsers(ids, all);
      resolve(users);
    });
  }

  createUser = (user: Omit<IUser, 'id'>) => {
    return new Promise<IUser>(async resolve => {
      const newUser = await this.usersService.postUser(user);
      if (newUser.groups.length > 0) {
        await this.groupsService.addUserToGroups(newUser);
      }

      resolve(newUser);
    });
  }

  editUser = (user: IUser) => {
    return new Promise<void>(async resolve => {
      const res = await this.usersService.putUser(user);
      if (this.simpleUserWasEdited(res.oldUser, res.newUser)) {
        await this.groupsService.updateUserFromGroups(res.newUser);
      }

      if (this.userGroupsWasChanged(res.oldUser, res.newUser)) {
        await this.groupsService.removeUsersFromGroups([res.newUser.id as string]);
        await this.groupsService.addUserToGroups(res.newUser);
      }

      resolve();
    });
  }

  deleteUser = (id: string) => {
    return new Promise<void>(resolve => {
      Promise.all([
        this.usersService.deleteUsers([id]),
        this.groupsService.removeUsersFromGroups([id])
      ]).then(() => {
        resolve();
      });
    });
  }

  simpleUserWasEdited(oldUser: IUser, newUser: IUser): boolean {
    return (oldUser.name !== newUser.name || oldUser.picture !== newUser.picture);
  }

  userGroupsWasChanged(oldUser: IUser, newUser: IUser): boolean {
    return (JSON.stringify(oldUser.groups) !== JSON.stringify(newUser.groups));
  }

  getRecords = (ids?: Array<string>) => {
    return new Promise<Array<ICashFlowRecord>>(async resolve => {
      const records = await this.cashFlowService.getRecords(ids);
      resolve(records);
    });
  }

  createRecord = (record: Omit<ICashFlowRecord, 'id'>) => {
    return new Promise<ICashFlowRecord>(async resolve => {
      const newRecord = await this.cashFlowService.postRecord(record);
      resolve(newRecord);
      if (newRecord.user) {
        const users = await this.usersService.getUsers([newRecord.user.id]);
        if (users.length > 0) {
          const user = users[0];
          user.lastRecord = { id: newRecord.id, date: newRecord.date, group: newRecord.group, amount: newRecord.amount };
          this.usersService.putUser(user);
        }
      }
    });
  }

  editRecord = (record: ICashFlowRecord) => {
    return new Promise<{oldRecord: ICashFlowRecord, newRecord: ICashFlowRecord}>(async resolve => {
      const res = await this.cashFlowService.putRecord(record);
      resolve(res);
    });
  }

  deleteRecord = (id: string) => {
    return new Promise<void>(async resolve => {
      await this.cashFlowService.deleteRecords([id]);
      resolve();
    });
  }

  getCategories = (ids?: Array<string>) => {
    return new Promise<Array<ICategory>>(async resolve => {
      const categories = await this.categoriesService.getCategories(ids);
      resolve(categories);
    });
  }

  createCategory= (category: Omit<ICategory, 'id'>) => {
    return new Promise<ICategory>(async resolve => {
      const newCategory = await this.categoriesService.postCategory(category);
      resolve(newCategory);
    });
  }

  editCategory = (category: ICategory) => {
    return new Promise<void>(resolve => {
      Promise.all([
        this.categoriesService.putCategory(category),
        this.cashFlowService.updateCategoryFromRecords(category)
      ]).then(() => {
        resolve();
      });
    });
  }

  deleteCategories = (ids: Array<string>) => {
    return new Promise<void>(resolve => {
      Promise.all([
        this.categoriesService.deleteCategories(ids),
        this.libraryService.removeCategoriesFromLibrary(ids)
      ]).then(() => {
        resolve();
      });
    });
  }

  getLibrary = (ids?: Array<string>) => {
    return new Promise<Array<ILibraryRecord>>(async resolve => {
      const library = await this.libraryService.getLibrary(ids);
      resolve(library);
    });
  }

  createLibraryRecord= (record: Omit<ILibraryRecord, 'id'>) => {
    return new Promise<ILibraryRecord>(async resolve => {
      const newLibraryRecord = await this.libraryService.postLibrary(record);
      resolve(newLibraryRecord);
    });
  }

  editLibraryRecord = (record: ILibraryRecord) => {
    return new Promise<void>(async resolve => {
      await this.libraryService.putLibrary(record);
      resolve();
    });
  }

  deleteLibraryRecord = (id: string) => {
    return new Promise<void>(async resolve => {
      await this.libraryService.deleteLibrary([id]);
      resolve();
    });
  }

  getAttendanceSheets = (ids?: Array<string>) => {
    return new Promise<Array<IAttendanceSheet>>(async resolve => {
      const attendances = await this.attendanceService.getAttendanceSheets(ids);
      resolve(attendances);
    });
  }

  createAttendanceSheet = (attendanceSheet: Omit<IAttendanceSheet, 'id'>) => {
    return new Promise<IAttendanceSheet>(async resolve => {
      const newAttendanceSheet = await this.attendanceService.postAttendanceSheet(attendanceSheet);
      resolve(newAttendanceSheet);
    });
  }

  editAttendanceSheet = (attendanceSheet: IAttendanceSheet) => {
    return new Promise<void>(async resolve => {
      await this.attendanceService.putAttendanceSheet(attendanceSheet);
      resolve();
    });
  }

  deleteAttendanceSheet = (id: string) => {
    return new Promise<void>(async resolve => {
      await this.attendanceService.deleteAttendanceSheets([id]);
      resolve();
    });
  }

  getUserAttendance = (id: string) => {
    return new Promise<Array<IAttendanceEvent>>(async resolve => {
      const attendanceEvents = await this.attendanceService.getUserAttendance(id);
      resolve(attendanceEvents);
    });
  }
}
