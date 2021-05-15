import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ICONS } from '@core/constants';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'icon-picker',
  templateUrl: 'icon-picker.html',
  styleUrls: ['icon-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconPickerComponent {
  @Input() icon: string;
  @Output() iconChange = new EventEmitter<string>();

  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) {}

  async showIcons() {
    const modal = await this.modalController.create({
      component: IconsModalComponent,
      componentProps: {
        icon: this.icon
      }
    });

    modal.onWillDismiss().then(res => {
      if (res.data) {
        this.icon = res.data;
        this.iconChange.emit(res.data);
      }
    });

    return modal.present();
  }
}

@Component({
  selector: 'icons-modal',
  templateUrl: 'icons-modal.html',
  styleUrls: ['icon-picker.scss']
})
export class IconsModalComponent {
  @Input() icon: string;
  icons: Array<{value: string, active: boolean}> = [];
  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    ICONS.forEach(_icon => {
      if (_icon === this.icon) {
        this.icons.push({ value: _icon, active: true });
      } else {
        this.icons.push({ value: _icon, active: false });
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  selectIcon(icon: string) {
    this.modalController.dismiss(icon);
  }
}
