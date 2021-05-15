import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'daily-cash-flow',
  templateUrl: 'daily-cash-flow.html',
  styleUrls: ['daily-cash-flow.scss']
})
export class DailyCashFlowComponent {
  @Input() dailyCashFlow: any;
  @Output() onclick = new EventEmitter();
}
