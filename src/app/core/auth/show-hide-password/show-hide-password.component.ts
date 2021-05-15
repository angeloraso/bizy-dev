import { Component, ContentChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
@Component({
  selector: 'show-hide-password',
  templateUrl: './show-hide-password.html',
  styleUrls: ['./show-hide-password.scss']
})
export class ShowHidePasswordComponent {
  @ContentChild(IonInput) input: IonInput;
  showPassword = false;

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
