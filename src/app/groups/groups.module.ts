import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GroupCardComponent } from './components';
import { GroupsRoutingModule } from './groups.routing';

@NgModule({
  imports: [
    SharedModule,
    GroupsRoutingModule
  ],
  declarations: [
    GroupsRoutingModule.COMPONENTS,
    GroupCardComponent
  ]
})
export class GroupsModule { }
