import { SimpleGroup } from '@groups/model';
import { SimpleUser } from './../users/model';
export interface ICategory {
  id: string;
  icon: string;
  name: string;
  color: string;
}

export type Payment = 'cash' | 'credit' | 'debit' | 'digital' | 'transfer';

interface IRecord {
  id: string;
  group: SimpleGroup;
  user: SimpleUser | null;
  category: ICategory;
  description: string | null;
  amount: number;
  payment: Payment;
}
export interface ICashFlowRecord extends IRecord {
  date: string;
}

export type SimpleRecord = Pick<ICashFlowRecord, 'id' | 'group' | 'date' | 'amount'>;
export interface ILibraryRecord extends ICashFlowRecord {
  name: string;
}
