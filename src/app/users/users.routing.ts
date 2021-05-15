import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '@users/user/user.component';
import { UsersComponent } from '@users/users.component';
import { UserAttendanceComponent } from './user-attendance/user-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    pathMatch: 'full'
  },
  {
    path: 'new',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserComponent
      }
    ]
  },
  {
    path: ':userId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserComponent
      },
      {
        path: 'cash-flow',
        loadChildren: () => import('@cash-flow/cash-flow.module').then(m => m.CashFlowModule)
      },
      {
        path: 'attendance',
        component: UserAttendanceComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
  static COMPONENTS = [
    UsersComponent,
    UserComponent,
    UserAttendanceComponent
  ];
}
