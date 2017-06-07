import { Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'my-input',
  template: '<div><ion-input type={{type}} placeholder={{placeholder}} clearInput [(ngModel)]="inputVal" value={{val}}></ion-input >' +
  '<span (click)="del($event)">删除</span>{{inputVal}}</div>',
  inputs: ['type', 'placeholder', 'val'],
  outputs: ['changed']
})

export class MyInput{
  inputVal: string;

  changed = new EventEmitter();

  del(e){
    console.log(this.inputVal)
    this.changed.emit(this.inputVal);
  }
}
