import { SimpleRecord } from '@cash-flow/model';
import { SimpleGroup } from '@groups/model';
export interface IUser {
  id: string;
  name: string;
  picture: string;
  date: string;
  lastRecord: SimpleRecord | null;
  phones: Array<string>;
  groups: Array<SimpleGroup>;
  deleted: boolean;
}

export type SimpleUser = Pick<IUser, 'id' | 'name' | 'picture'>;
