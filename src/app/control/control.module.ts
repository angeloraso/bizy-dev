import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ControlRoutingModule } from './control.routing';

@NgModule({
  imports: [
    SharedModule,
    ControlRoutingModule
  ],
  declarations: [
    ControlRoutingModule.COMPONENTS
  ]
})
export class ControlModule {}
