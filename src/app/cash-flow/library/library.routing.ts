import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashFlowRecordComponent } from '@cash-flow/cash-flow-record/cash-flow-record.component';
import { LibraryComponent } from './library.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LibraryComponent
  },
  {
    path: 'new',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CashFlowRecordComponent
      },
      {
        path: 'categories',
        loadChildren: () => import('@cash-flow/categories/categories.module').then(m => m.CategoriesModule)
      }
    ]
  },
  {
    path: ':libraryRecordId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CashFlowRecordComponent
      },
      {
        path: 'categories',
        loadChildren: () => import('@cash-flow/categories/categories.module').then(m => m.CategoriesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule {
  static COMPONENTS = [
    LibraryComponent
  ];
}
