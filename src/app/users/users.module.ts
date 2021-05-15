import { NgModule } from '@angular/core';
import { EventCalendarModule } from '@components/event-calendar/event-calendar.module';
import { SharedModule } from '@shared/shared.module';
import { SelectImgComponent } from './select-img/select-img.component';
import { UserCardComponent } from './user-card/user-card.component';
import { AddUserPopover } from './users.component';
import { UsersRoutingModule } from './users.routing';

@NgModule({
  imports: [
    SharedModule,
    UsersRoutingModule,
    EventCalendarModule
  ],
  declarations: [
    UsersRoutingModule.COMPONENTS,
    UserCardComponent,
    SelectImgComponent,
    AddUserPopover
  ]
})
export class UsersModule {}
