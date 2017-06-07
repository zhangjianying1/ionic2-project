import { Component } from '@angular/core';
import {HomeService} from './home.service';

@Component({
  selector: 'home-soccer-item',
  templateUrl: 'home.soccer.item.component.html',
  inputs: ['selectResult', 'matchList', 'toggleShow']
})
export class HomeSoccerItemComponent {
  constructor(homeService: HomeService){

  }

  //public serviceSoccer: ServiceSoccer;


}
