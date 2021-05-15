import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from '@groups/group/group.component';
import { GroupsComponent } from '@groups/groups.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    pathMatch: 'full'
  },
  {
    path: 'new',
    component: SettingsComponent
  },
  {
    path: ':groupId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: GroupComponent
      },
      {
        path: 'users',
        loadChildren: () => import('@users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'attendance',
        loadChildren: () => import('@groups/attendance/attendance.module').then(m => m.AttendanceModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('@groups/analytics/analytics.module').then(m => m.AnalyticsModule)
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {
  static COMPONENTS = [
    GroupsComponent,
    GroupComponent,
    SettingsComponent
  ];
}
