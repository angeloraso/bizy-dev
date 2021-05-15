import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashFlowToggleComponent } from './cash-flow-toggle.component';
@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [
    CashFlowToggleComponent
  ],
  exports: [
    CashFlowToggleComponent
  ]
})
export class CashFlowToggleModule { }
