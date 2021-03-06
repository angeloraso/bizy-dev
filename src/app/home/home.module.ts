import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BottomBarService } from './bottomBar.service';
import { HomeRoutingModule } from './home.routing';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeRoutingModule.COMPONENTS
  ],
  providers: [
    BottomBarService
  ]
})
export class HomeModule {}
