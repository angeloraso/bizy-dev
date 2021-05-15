import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { COLORS } from '@core/constants';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'color-picker',
  templateUrl: 'color-picker.html',
  styleUrls: ['color-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent {
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();

  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) {}

  async showColors() {
    const modal = await this.modalController.create({
      component: ColorsModalComponent,
      componentProps: {
        color: this.color
      }
    });

    modal.onWillDismiss().then(res => {
      if (res.data) {
        this.color = res.data;
        this.colorChange.emit(res.data);
      }
    });

    return modal.present();
  }
}

@Component({
  selector: 'colors-modal',
  templateUrl: 'colors-modal.html',
  styleUrls: ['color-picker.scss']
})
export class ColorsModalComponent {
  @Input() color: string;
  colors: Array<{value: string, active: boolean}> = [];
  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    COLORS.forEach(_color => {
      if (_color === this.color) {
        this.colors.push({ value: _color, active: true });
      } else {
        this.colors.push({ value: _color, active: false });
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  selectColor(color: string) {
    this.modalController.dismiss(color);
  }
}
