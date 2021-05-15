
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'selectable-user-card',
  templateUrl: 'selectable-user-card.html',
  styleUrls: ['selectable-user-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectableUserCardComponent {
  @Input() user: any;
  @Input() readOnly: boolean = false;
  @Input() isChecked = false;
  @Output() check = new EventEmitter<boolean>();

  checkUser() {
    if (this.readOnly) {
      return;
    }

    this.isChecked = !this.isChecked;
    this.check.emit(this.isChecked);
  }
}
