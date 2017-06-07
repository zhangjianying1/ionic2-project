import { Injectable, Pipe} from '@angular/core';

@Pipe({
  name: 'mobilellipsis'
})
@Injectable()
export class MobileEllipsis{
  transform(value, args) {
     return value.substring(0, 3) + '****'+ value.slice(-4);
  }
}
