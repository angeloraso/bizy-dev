import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { AuthService } from './auth.service';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthRoutingModule.COMPONENTS,
    ShowHidePasswordComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
