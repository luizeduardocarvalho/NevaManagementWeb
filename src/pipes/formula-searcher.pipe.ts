import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formulaAndNameSearch',
})
export class FormulaAndNameSearchPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return items.filter((item) => {
      let normalizedItemName = item.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      if (item.formula != null) {
        let normalizedFormula = item.formula
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return (
          normalizedFormula.includes(searchText) ||
          normalizedItemName.includes(searchText)
        );
      } else {
        return normalizedItemName.includes(searchText);
      }
    });
  }
}
