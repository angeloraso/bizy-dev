import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'confirm-footer',
  templateUrl: 'confirm-footer.html',
  styleUrls: ['confirm-footer.scss']
})
export class ConfirmFooterComponent {
  @Input() cancel = 'Cancel';
  @Input() confirm = 'Confirm';
  @Input() icon = false;
  @Output() cancelClick = new EventEmitter();
  @Output() confirmClick = new EventEmitter();
}
