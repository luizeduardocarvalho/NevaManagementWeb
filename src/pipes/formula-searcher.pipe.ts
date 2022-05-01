import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formulaAndNameSearch'
})
export class FormulaAndNameSearchPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter(item => {
            if(item.formula != null) {
                return (item.formula.toLowerCase().includes(searchText) || item.name.toLowerCase().includes(searchText));
            }

            return false;
        })
    };
}
