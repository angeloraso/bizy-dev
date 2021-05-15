import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'groups',
        pathMatch: 'full'
      },
      {
        path: 'groups',
        loadChildren: () => import('@groups/groups.module').then(m => m.GroupsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cash-flow',
        loadChildren: () => import('@cash-flow/cash-flow.module').then(m => m.CashFlowModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('@users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'control',
        loadChildren: () => import('@control/control.module').then(m => m.ControlModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
  static COMPONENTS = [HomeComponent];
}
