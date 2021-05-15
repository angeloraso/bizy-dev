import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'prev-next',
  templateUrl: 'prev-next.html',
  styleUrls: ['prev-next.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrevNextComponent {
  @Input() text: string;
  @Output() prev = new EventEmitter<void>()
  @Output() next = new EventEmitter<void>()

  private _total: number = 0;
  counter: number;

  get total(): number {
    return this._total;
  }

  @Input() set total(value: number) {
    this._total = value;
    if (typeof this.counter === 'undefined') {
      this.counter = value;
    }
  }
}
