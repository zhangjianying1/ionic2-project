import { Injectable, Pipe} from '@angular/core';

@Pipe({
  name: 'clearFirst'
})
@Injectable()
export class MyPipeClass{
  transform(value, args) {
    return value.substring(1);
  }
}
