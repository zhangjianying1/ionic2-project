import { Injectable, Pipe} from '@angular/core';

@Pipe({
  name: 'card'
})
@Injectable()
export class Card{
  transform(value, args) {
    let re = /(\d*)(\d{4})/g
    return value.replace(re, function($1, $2) {
      $2 = '**********************'.slice(0, $2.length)
      return $2 + ' ' + $1.slice(-4) ;
    });
  }
}
