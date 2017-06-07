import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import{ AppStore } from '../../app/app.service';

import { WxRecharge } from './wx.recharge';
import { ZfbRecharge } from './zfb.recharge';
import { LoginIn } from '../login/login.in';

@Component({
  selector: 'recharge-cont',
  templateUrl: 'recharge.html'
})
export class Recharge implements OnInit{
  constructor(
    private navCtrl: NavController,
    private appStore: AppStore
  ){}
  ngOnInit(){
    if (!this.appStore.get('user')) {
      this.navCtrl.push(LoginIn)
    }
  }
  public toRecharge(sign){
    let target = sign == 'wx' ? WxRecharge : ZfbRecharge;
    this.navCtrl.push(target);
  }
}
