import { NgModule } from '@angular/core';
import { CashFlowToggleModule } from '@cash-flow/cash-flow-toggle/cash-flow-toggle.module';
import { SharedModule } from '@shared/shared.module';
import { LibraryRecordCardComponent } from './library-record-card/library-record-card.component';
import { LibraryRoutingModule } from './library.routing';

@NgModule({
  imports: [
    SharedModule,
    LibraryRoutingModule,
    CashFlowToggleModule
  ],
  declarations: [
    LibraryRoutingModule.COMPONENTS,
    LibraryRecordCardComponent
  ]
})
export class LibraryModule { }
