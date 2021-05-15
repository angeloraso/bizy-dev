import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule
  ]
})
export class SharedModule {}
