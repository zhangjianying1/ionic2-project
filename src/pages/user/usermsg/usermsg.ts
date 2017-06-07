import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, NavController } from 'ionic-angular';
import { RealName } from './realname/realname';
import { Bank } from './bank/bank';
import { ModifyPassword } from './modifypassword/modify.password';
import { AppStore } from '../../../app/app.service';

@Component({
  selector: 'user-msg',
  templateUrl: './usermsg.html'
})
export class UserMsg implements OnInit{
  public userData: any;
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private appStore: AppStore
  ){}
  ngOnInit(){
   this.userData = this.appStore.state['user'];
  }
  public toOther(sign){
    let target: any;

    switch (sign) {

      //真实姓名
      case 'ZSXM':
        target = RealName;
        break;

      //修改密码
      case 'XGMM':
        target = ModifyPassword;
        break;

      // 添加银行信息
      case 'YH':
        target = Bank
        break;
    }
    this.navCtrl.push(target);
  }

}
