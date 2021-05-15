import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CategoriesComponent
  },
  {
    path: 'new',
    component: CategoryComponent
  },
  {
    path: ':categoryId',
    component: CategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {
  static COMPONENTS = [
    CategoriesComponent,
    CategoryComponent
  ];
}
