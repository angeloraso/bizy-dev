import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashFlowRecordComponent } from '@cash-flow/cash-flow-record/cash-flow-record.component';
import { CashFlowComponent } from './cash-flow.component';

const routes: Routes = [
  {
    path: '',
    component: CashFlowComponent,
    pathMatch: 'full'
  },
  {
    path: 'library',
    loadChildren: () => import('@cash-flow/library/library.module').then(m => m.LibraryModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('@cash-flow/categories/categories.module').then(m => m.CategoriesModule)
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
      },
      {
        path: 'library',
        loadChildren: () => import('@cash-flow/library/library.module').then(m => m.LibraryModule)
      }
    ]
  },
  {
    path: ':recordId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CashFlowRecordComponent
      },
      {
        path: 'categories',
        loadChildren: () => import('@cash-flow/categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'library',
        loadChildren: () => import('@cash-flow/library/library.module').then(m => m.LibraryModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule {
  static COMPONENTS = [
    CashFlowComponent,
    CashFlowRecordComponent
  ];
}
