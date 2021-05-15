import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import { BackButtonComponent } from './back-button/back-button.component';
import { ColorPickerComponent, ColorsModalComponent } from './color-picker/color-picker.component';
import { ConfirmFooterComponent } from './confirm-footer/confirm-footer.component';
import { GroupPickerComponent, GroupsModalComponent } from './group-picker/group-picker.component';
import { IconPickerComponent, IconsModalComponent } from './icon-picker/icon-picker.component';
import { PrevNextComponent } from './prev-next/prev-next.component';
import { SelectableUserCardComponent } from './selectable-user-card/selectable-user-card.component';
import { UserPickerComponent, UsersModalComponent } from './user-picker/user-picker.component';
import { UserPickerService } from './user-picker/user-picker.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    PipesModule
  ],
  declarations: [
    ConfirmFooterComponent,
    BackButtonComponent,
    ColorPickerComponent,
    ColorsModalComponent,
    IconPickerComponent,
    IconsModalComponent,
    PrevNextComponent,
    UserPickerComponent,
    UsersModalComponent,
    SelectableUserCardComponent,
    GroupPickerComponent,
    GroupsModalComponent
  ],
  exports: [
    ConfirmFooterComponent,
    BackButtonComponent,
    ColorPickerComponent,
    ColorsModalComponent,
    IconPickerComponent,
    IconsModalComponent,
    PrevNextComponent,
    UserPickerComponent,
    UsersModalComponent,
    SelectableUserCardComponent,
    GroupPickerComponent,
    GroupsModalComponent
  ],
  providers: [
    UserPickerService
  ]
})
export class ComponentsModule { }
