import { SimpleUser } from '@users/model';
export interface IGroup {
  id: string;
  name: string;
  color: string;
  description: string;
  users: Array<SimpleUser>;
  deleted?: boolean;
}

export type SimpleGroup = Pick<IGroup, 'id' | 'name' | 'color'>;
export interface IAttendanceSheet {
  id: string;
  group: SimpleGroup;
  users: Array<IAttendanceSheetUser>;
  date: string;
}

export interface IAttendanceSheetUser extends SimpleUser {
  checked: boolean;
}

export interface IAttendanceEvent {
  group: SimpleGroup,
  date: string
}
