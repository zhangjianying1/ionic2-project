import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import { publicUtil } from '../../utils/publicutil';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class Welcome{

  constructor(
    public navCtrl: NavController
  ) {}

  public closeStart(){
    publicUtil.store.setData('start', true);
    this.navCtrl.setRoot(TabsPage);
  }


}

