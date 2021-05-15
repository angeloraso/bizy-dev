import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderAlphabetically'
})
export class OrderAlphabeticallyPipe implements PipeTransform {
  transform(elements: Array<unknown>, property: string = '', order: 'asc' | 'desc' = 'asc'): Array<any> {
    // No elements
    if (!elements || !order) {
      return elements;
    }

    // Array with only one item
    if (elements.length <= 1) {
      return elements;
    }

    if (property === '') {
      if (order === 'asc') {
        elements.sort();
        return [...elements];
      }

      elements.sort().reverse();
      return [...elements];
    }

    elements.sort((a: any, b: any) => {
      let aValue = a[property];
      let bValue = b[property];

      if (typeof aValue === 'undefined' && typeof bValue === 'undefined') {
        return 0;
      }

      if (typeof aValue === 'undefined' && typeof bValue !== 'undefined') {
        return order === 'desc' ? 1 : -1;
      }

      if (typeof aValue !== 'undefined' && typeof bValue === 'undefined') {
        return order === 'desc' ? -1 : 1;
      }

      if (aValue === bValue) {
        return 0;
      }

      if (order === 'desc') {
        return (aValue.toString().toLowerCase() > bValue.toString().toLowerCase() ? -1 : 1);
      }

      return (bValue.toString().toLowerCase() > aValue.toString().toLowerCase() ? -1 : 1);
    });
    return [...elements];
  }
}
