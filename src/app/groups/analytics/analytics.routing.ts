import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AttendanceSheetComponent } from './attendance-sheet/attendance-sheet.component';
import { AttendanceSheetsComponent } from './attendance-sheets/attendance-sheets.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
    pathMatch: 'full'
  },
  {
    path: 'attendance-sheets',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AttendanceSheetsComponent
      },
      {
        path: 'users',
        loadChildren: () => import('@users/users.module').then(m => m.UsersModule)
      },
      {
        path: ':attendanceSheetId',
        component: AttendanceSheetComponent
      }
    ]
  },
  {
    path: 'cash-flow',
    loadChildren: () => import('@cash-flow/cash-flow.module').then(m => m.CashFlowModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {
  static COMPONENTS = [
    AnalyticsComponent,
    AttendanceSheetsComponent,
    AttendanceSheetComponent
  ];
}
