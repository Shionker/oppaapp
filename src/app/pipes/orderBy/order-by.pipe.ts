import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any, sort: string): unknown {
    console.log(array, sort)
    let sortedArray
    switch (sort) {
      case 'alphaAsc':
      default:
        sortedArray = array.sort((a, b) => a.title.localeCompare(b.title));
        break
      case 'alphaDesc':
        sortedArray = array.sort((a, b) => b.title.localeCompare(a.title));
        break
      case 'priceAsc':
        sortedArray = array.sort((a, b) => a.price - b.price);
        break
      case 'priceDesc':
        sortedArray = array.sort((a, b) => b.price - a.price);
        break
    }

    return sortedArray
  }

}
