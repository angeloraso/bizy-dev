import { Inject, Pipe, PipeTransform } from '@angular/core';
import Fuse from 'fuse.js';
import { OrderAlphabeticallyPipe } from '../order-alphabetically.pipe';
import { FuseOptions, IFuseOptions, IFuseResult } from './search.model';
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  fuseOptions: IFuseOptions;
  fuse: Fuse<any>;
  elements: Array<unknown>;

  constructor(
    @Inject(OrderAlphabeticallyPipe) private order: OrderAlphabeticallyPipe
  ) {}

  transform(elements: Array<unknown>, search: string, keys: Array<string>, options?: IFuseOptions): Array<any> {
    if (!search || !keys) {
      return this.order.transform(elements, 'name');
    }

    if (!this.fuseOptions) {
      this.fuseOptions = new FuseOptions(options!, keys);
    }

    if (!this.fuse || this.elements !== elements) {
      this.elements = elements;
      this.fuse = new Fuse(elements, this.fuseOptions);
    }

    const fuseResult = this.fuse.search(search) as Array<IFuseResult>;
    // Get each IFuseResult item
    const output = fuseResult.map(match => match.item);
    return output;
  }
}
