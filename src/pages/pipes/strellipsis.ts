import { Injectable, Pipe} from '@angular/core';

@Pipe({
  name: 'strellipsis'
})
@Injectable()
export class StrEllipsis{
  transform(value, args) {

    if (!value) return '0';
    if (value.length >= args) {
      return value.substring(0, 5);
    }
    return value;

  }
}
