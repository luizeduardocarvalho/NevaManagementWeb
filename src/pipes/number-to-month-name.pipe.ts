import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toMonthName'
})
export class NumberToMonthNamePipe implements PipeTransform {

    transform(monthNumber: number): string {
        if (!monthNumber || (monthNumber < 1 && monthNumber > 12)) {
            return "";
        }

        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        return date.toLocaleString('en-US', {
          month: 'long',
        });
    };
}
