import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AttendanceRoutingModule } from './attendance.routing';

@NgModule({
  imports: [
    SharedModule,
    AttendanceRoutingModule
  ],
  declarations: [
    AttendanceRoutingModule.COMPONENTS
  ]
})
export class AttendanceModule {}
