import { Component } from '@angular/core';
import { Platform, ToastController, AlertController, NavController, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Request } from '../../utils/request';
import { Profile } from './profile';

@Component({
  selector: 'capital-zfb',
  templateUrl: 'zfb.recharge.html'
})
export class ZfbRecharge {
  public prize: any;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private request: Request,
    private modalCtrl: ModalController,
    private inAppBrowser: InAppBrowser
  ){}
  public price: any;
  public bBtn: boolean = true;

  public rechargeHandle(){
    let msg = '', re = /^[0-9]*$/;

    if (!re.test(this.price)) {
      msg = '请输入正确的金额';
    } else if (this.price < 2) {
      msg = '充值金额不能小于2元';

    }

    if (msg) {
      this.toast(msg);
      return;
    }

    if (!this.bBtn) return;
    this.bBtn = false;
    this.request.post('3202', 'alipay', {amount: this.price}).then((res) => {

      if (!res['code']) {
        let payUrl = res['payUrl'];
        this.presentProfileModal(payUrl);
        setTimeout(()=>{
          this.bBtn = true;
        }, 2000)
      } else {
        this.toast(res['msg']);
        this.bBtn = true;
      }

    })
  }
  presentProfileModal(payUrl) {

    if (this.platform.is("android")) {
      let profileModal = this.modalCtrl.create(Profile, { payUrl: payUrl, title: '充值跳转中...' });
      profileModal.present();
    } else {
      this.inAppBrowser.create(payUrl, '_system');
    }

  }
  toast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
}
