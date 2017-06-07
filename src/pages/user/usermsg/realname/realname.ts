import { Component } from '@angular/core';
import { ToastController, NavController, LoadingController} from 'ionic-angular';
import { Request } from '../../../../utils/request';
import { AppStore } from '../../../../app/app.service';
@Component({
  selector: 'realname-cont',
  templateUrl: 'realname.html'
})
export class RealName{
  public user: any = {
    realName: '',
    cardName: ''
  }
  public bBtn = true;
  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private request: Request,
    private appStore: AppStore,
    private loadingCtrl: LoadingController
  ){}
  public toOther(sign){
    let target: any;

    switch (sign) {
      case 'FA':
        target = ''
        break;
    }
    this.navCtrl.push(target);
  }
  confirmHandle(){

    let msg: string,
      codeRE = /^(([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)))$/g,
      emptyRE = /\S/g;



    if (!this.user.realName) {
      msg = '真实姓名不能为空';
    } else if (!emptyRE.test(this.user.cardCode)) {
      msg = '身份证号码不能为空'
    } else if (!codeRE.test(this.user.cardCode)) {
      msg = '身份证号码不正确';
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
    this.request.post('3103', 'real', this.user).then((res) => {

      this.bBtn = true;
      if (!res['code']) {
        let userMsg = this.appStore.get('user');
        userMsg.realName = this.user.realName;
        userMsg.cardCode = this.user.cardCode;
        this.appStore.set('user', userMsg);


        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: '成功'
        });

        loading.present();

        setTimeout(() => {
          this.navCtrl.pop();
        }, 1000);

        setTimeout(() => {
          loading.dismiss();
        }, 2000);
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
}
