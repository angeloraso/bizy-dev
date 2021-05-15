import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderAlphabeticallyPipe } from './order-alphabetically.pipe';
import { SearchPipe } from './search/search.pipe';
@NgModule({
  declarations: [
    OrderAlphabeticallyPipe,
    SearchPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OrderAlphabeticallyPipe,
    SearchPipe
  ],
  providers: [
    OrderAlphabeticallyPipe
  ]
})
export class PipesModule { }
