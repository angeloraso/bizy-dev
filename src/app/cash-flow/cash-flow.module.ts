import { NgModule } from '@angular/core';
import { CashFlowToggleModule } from '@cash-flow/cash-flow-toggle/cash-flow-toggle.module';
import { DailyCashFlowComponent } from '@cash-flow/daily-cash-flow/daily-cash-flow.component';
import { SharedModule } from '@shared/shared.module';
import { CashFlowRoutingModule } from './cash-flow.routing';
@NgModule({
  imports: [
    SharedModule,
    CashFlowRoutingModule,
    CashFlowToggleModule
  ],
  declarations: [
    CashFlowRoutingModule.COMPONENTS,
    DailyCashFlowComponent
  ]
})
export class CashFlowModule { }
