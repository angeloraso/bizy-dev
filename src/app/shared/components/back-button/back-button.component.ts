import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { RouterService } from '@core/services/router.service';
@Component({
  selector: 'back-button',
  templateUrl: 'back-button.html',
  styleUrls: ['back-button.scss'],
  providers: [RouterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackButtonComponent {
  @Input() text: string = 'Back';
  @Output() action = new EventEmitter<void>();
  constructor(
    @Inject(RouterService) private router: RouterService
  ) {}

  goBack() {
    this.router.goBack();
    this.action.emit();
  }
}

