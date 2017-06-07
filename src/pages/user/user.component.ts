import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { LoginIn } from '../login/login.in';
import { Recharge } from '../prize/recharge';
import { AboutUs } from './aboutus/aboutus';
import { Capital } from './capital/capital';
import { Programme } from './programme/programme';
import { UserMsg } from './usermsg/usermsg';
import { Draw } from '../prize/draw';
import { Request } from '../../utils/request';
import { AppStore } from '../../app/app.service';
import { publicUtil } from '../../utils/publicutil';

@Component({
  selector: 'user-cont',
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit{
  public isShow: boolean = true;
  constructor(
    private navCtrl: NavController,
    private request: Request,
    private navParams: NavParams,
    private appStore: AppStore,
    private callNumber: CallNumber,
    private modalCtrl: ModalController
  ){}
  ngOnInit(){
    if (!this.isShow) return;
    this.doRefresh();
  }
  ionViewWillEnter(){
    if (!this.appStore._state['user'].token) {
      this.isShow = false;
      let profileModal = this.modalCtrl.create(LoginIn, {back: 'user'});
      profileModal.present();
    }
  }

  doRefresh(refresher?: any){
    this.request.post('3102', 'member').then((res) => {

      if (!res['code']) {
        this.appStore.set('user', Object.assign(this.appStore.get('user'), res));
      }
      refresher && refresher.complete();
    })
  }
  public toOther(sign){
    let target: any;

    switch (sign) {
      // 方案
      case 'FA':
        target = Programme;
        break;
      // 资金
      case 'ZJMX':
        target = Capital;
        break;
      // 实名认证
      case 'SMRZ':
        target = UserMsg;
        break;
      // 关于我们
      case 'GYWM':
        target = AboutUs;
        break;
      // 充值
      case 'CZ':
        target = Recharge;
        break;
      // 提现
      case 'TX':
        target = Draw;
        break;
    }
    this.navCtrl.push(target);
  }
  public call(){
    this.callNumber.callNumber('400666780', true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }
  loginOut(){
    publicUtil.store.setData('password', '');
    publicUtil.store.setData('userName', '');
    publicUtil.store.setData('token', '');
    this.appStore.set('user', {});
    this.navCtrl.parent.select(0);
  }
}
