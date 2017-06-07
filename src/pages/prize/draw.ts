import { Component } from '@angular/core';
import { ToastController, AlertController, NavController } from 'ionic-angular';

import{ AppStore } from '../../app/app.service';
import { Request } from '../../utils/request';
import { RealName } from '../user/usermsg/realname/realname';
import { Bank } from '../user/usermsg/bank/bank';

@Component({
  selector: 'draw-cont',
  templateUrl: 'draw.html'
})
export class Draw {
  public price: any;
  public placeholder = "可提现金额为¥ " + (this.appStore.state['user']['drawAmount'] || '0.00') + "元";
  public bBtn: boolean = true;
  constructor(
    private navCtrl: NavController,
    private appStore: AppStore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private request: Request
  ){}
  public drawHandle(){
    let userMsg = this.appStore._state['user'],
      target, msg: string, re = /^[0-9]*$/;



    if (!re.test(this.price)) {
      msg = '请输入正确的金额';
    } else if (this.price > userMsg.drawAmount) {
      msg = '您的可提现的现金不足';
    } else if (this.price < 10) {
      msg = '提现金额不能小于10元';

    }
    if (msg) {
      this.toast(msg);
      return;
    }

    if (!userMsg.realName) {
      target = RealName;
    } else if (!userMsg.bankName) {
      target = Bank;
    }

    if (target) {
      this.navCtrl.push(target);
      return;
    }
    if (!this.bBtn) return;
    this.bBtn = false;
    this.request.post('3203', 'bank', {amount: this.price, isBankCheck: 0}).then((res) => {
      this.bBtn = true;

      if (!res['code']) {
        let alert = this.alertCtrl.create({
          title: '',
          message: '您的提现申请已成功,请注意查收',
          buttons: [

            {
              text: '确定',
              cssClass: 'confirm-full',
              handler: () => {
                userMsg.cashAmount = (Number(userMsg.drawAmount) - Number(this.price)).toFixed(2);
                this.placeholder = "可提现金额为¥ " + (userMsg.drawAmount || '0.00') + "元";
                this.price = "";
              }
            }
          ]
        });
        alert.present();
      } else {
        this.toast(res['msg']);
      }

    })


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
