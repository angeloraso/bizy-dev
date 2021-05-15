import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AutoLoginGuard, IntroGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('@core/auth/auth.module').then(m => m.AuthModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: '-',
    loadChildren: () => import('@side-menu/side-menu.module').then(m => m.SideMenuModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('@core/intro/intro.module').then(m => m.IntroModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
