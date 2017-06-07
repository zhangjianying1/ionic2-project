import { Component} from '@angular/core';

@Component({
  selector: 'my-radio',
  template: `<div class="radio">
                <i
                   [ngClass]="checked ? 'radio-active' : 'radio-default'">
                </i>
                <span>{{name}}</span>


            </div>`,
  inputs: ['name', 'checked']
})

export class MyRadio{}
