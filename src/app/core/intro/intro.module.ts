import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroRoutingModule } from './intro.routing';

import { IntroComponent } from './intro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroRoutingModule
  ],
  declarations: [IntroComponent]
})
export class IntroModule {}
