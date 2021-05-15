import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'cash-flow-toggle',
  templateUrl: 'cash-flow-toggle.html',
  styleUrls: ['cash-flow-toggle.scss']
})
export class CashFlowToggleComponent {
  @Input() active = 0;
  @Output() activeChange = new EventEmitter<boolean>();
}
