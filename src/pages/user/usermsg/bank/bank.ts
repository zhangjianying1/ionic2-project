import { Component } from '@angular/core';
import { ToastController, NavController, LoadingController } from 'ionic-angular';
import { Request } from '../../../../utils/request';
import { AppStore } from '../../../../app/app.service';
@Component({
  selector: 'bank-cont',
  templateUrl: 'bank.html'
})
export class Bank{
  public bank: any = {
    bankCard: '',
    bankName: ''
  };
  public bBtn = true;
  public isShow: boolean = false;
  public bankData: any;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private request: Request,
    private appStore: AppStore,
    private loadingCtrl: LoadingController
  ){
    request.post('3203', 'bankList').then((res) => {
      this.bankData = [res['bankList']];
    })
  }
  confirmHandle(){

    let msg: string;
    if (!this.bank.bankCard) {
      msg = '银行卡号不能为空';
    } else if (!this.bank.bankName) {
        msg = '开户行不能为空'
    }

    if (msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        position: 'center',
        duration: 2000
      });
      toast.present();
      return;
    }
    if (!this.bBtn) return;
    this.bBtn = false;
    this.request.post('3103', 'drawBank', this.bank).then((res) => {
      this.bBtn = true;
      if (!res['code']) {
        let userMsg = this.appStore.get('user');
        userMsg.bankCode = this.bank.bankCard;
        userMsg.bankName = this.bank.bankName;

        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: '绑定成功'
        });

        loading.present();

        setTimeout(() => {
          this.navCtrl.pop();
        }, 1000);

        setTimeout(() => {
          loading.dismiss();
        }, 2000);

        this.appStore.set('user', Object.assign( this.appStore.get('user'), userMsg));

      } else {
        let toast = this.toastCtrl.create({
          message: res['msg'],
          position: 'middle',
          duration: 2000
        });
        toast.present();
      }

    })
  }
  selectHandle(value) {
    this.bank.bankName = value;
  }
  pickerHandle(){
      this.isShow = !this.isShow;
  }
}
