import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from '@users/model';

export type UserActionType = 'record';
@Component({
  selector: 'user-card',
  templateUrl: 'user-card.html',
  styleUrls: ['user-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() user: IUser & {noDebt: boolean};
  @Output() onclick = new EventEmitter();
  @Output() action = new EventEmitter<UserActionType>();
}
