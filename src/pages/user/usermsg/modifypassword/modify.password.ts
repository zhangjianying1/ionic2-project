import { Component} from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Request } from '../../../../utils/request';
import { md5 } from '../../../../utils/md5';

@Component({
  selector: 'modify-password',
  templateUrl: 'modify-password.html'
})
export class ModifyPassword {
  public bBtn: boolean = true;
  public login: any = {
    oldPassword: '',
    password: ''
  };
  constructor(
    public navCtrl: NavController,
    public request: Request,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {}


  registerHandle(){

    let msg: string;


    if (!this.login.oldPassword) {
      msg = '原密码不能为空'
    } else if (!this.login.password) {
      msg = '新密码不能为空'
    }

    if (msg) {
      toast.bind(this)(msg);
      return;
    }
    if (!this.bBtn) return;
    this.bBtn = false;

    this.request.post('3103', 'password', {oldPassword: md5(this.login.oldPassword), password: md5(this.login.password)}).then((res)=>{
      this.bBtn = true;
      let msg: string;

      // 原密码错误
      if (res['code'] == '1008') {
        msg = '原密码不正确';
      } else if (!res['code']) {

        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: '修改成功'
        });

        loading.present();

        setTimeout(() => {
          this.navCtrl.pop();
        }, 1000);

        setTimeout(() => {
          loading.dismiss();
        }, 2000);
      } else {
        msg = res['msg'];
      }

      if (msg) {
        toast.bind(this)(msg);
      }


    })

    function toast(msg){

      if (msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          position: 'middle',
          duration: 2000
        });
        toast.present();
        return;
      }
    }
  }

}
