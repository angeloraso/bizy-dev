import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AnalyticsRoutingModule } from './analytics.routing';

@NgModule({
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ],
  declarations: [
    AnalyticsRoutingModule.COMPONENTS
  ]
})
export class AnalyticsModule {}
