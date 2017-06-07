import { Component } from '@angular/core';

@Component({
  selector: 'error',
  template: '<div class="">{{msg}}</div>',
  inputs: ['msg']
})
export class Error{

}
