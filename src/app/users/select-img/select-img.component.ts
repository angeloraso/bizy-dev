import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'select-img',
  templateUrl: 'select-img.html',
  styleUrls: ['select-img.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectImgComponent {
  imgs = [
    'assets/img/unicorn.svg',
    'assets/img/female.svg',
    'assets/img/male.svg'
  ];

  constructor(
    @Inject(PopoverController) public popoverController: PopoverController
  ) {}

  selectImg(img: string) {
    this.popoverController.dismiss(img);
  }
}
