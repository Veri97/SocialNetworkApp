import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'timeAgoSecondsPipe'
})

export class TimeAgoSecondsPipe implements PipeTransform {
    transform(value: string, args?: any): any{
        const split = value.split(' ',2);
        if(+split[0] <= 59 && split[1] === 'seconds'){
            return 'less than one minute ago';
        }
        else {
            return value;
        }
    }
}