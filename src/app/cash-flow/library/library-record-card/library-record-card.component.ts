import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ILibraryRecord } from '@cash-flow/model';
@Component({
  selector: 'library-record-card',
  templateUrl: 'library-record-card.html',
  styleUrls: ['library-record-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryRecordCardComponent {
  @Input() record: ILibraryRecord;
  @Output() onclick = new EventEmitter();
  @Output() showOptions = new EventEmitter();
}
