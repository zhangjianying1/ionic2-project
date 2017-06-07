import { Component} from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Request } from '../../utils/request';
import { md5 } from '../../utils/md5';
import { AppStore } from '../../app/app.service';

@Component({
  selector: 'forget-password',
  templateUrl: 'forget-password.html'
})
export class ForgetPassword {
  public bBtn: boolean = true;
  public login: any = {
    mobile: '',
    password: '',
    repeatPassword: '',
    code: '',
    isSendCode: false
  };
  constructor(
    public navCtrl: NavController,
    public request: Request,
    public appStore: AppStore,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {}


  /**
   * 获取验证码
   */
  getCode() {
    let re = /^1[23456789]\d{9}$/g;
    if (!re.test(this.login.mobile)) {
      let toast = this.toastCtrl.create({
        message: '手机号不正确',
        position: 'middle',
        duration: 2000
      });
      toast.present();
      return;
    }
    // 发送验证码
    if (!this.login.isSendCode){
      this.request.post('3105', 'forgetPassword', {mobile: this.login.mobile}).then((res)=>{
        this.login.isSendCode = true;
        this.listenCode();
      })
    }

  }

  listenCode(){
    let count = 60;
    countNum.bind(this)();
    function countNum(){
      setTimeout(() => {
        count --;

        if (count == 1) {
          this.login.isSendCode = false;
        } else {
          countNum.bind(this)();
        }
      }, 1000)
    }
  }
  registerHandle(){

    let msg: string;

    if (!this.login.mobile) {
      msg = '手机号不能为空'
    } else if (!this.login.password) {
      msg = '密码不能为空'
    } else if (!this.login.repeatPassword) {
      msg = '重复密码不能为空'
    } else if (this.login.password != this.login.repeatPassword){
      msg = '两次输入的密码不匹配'
    } else if (!this.login.code) {
      msg = '验证码不能为空';
    }


    if (msg) {
      this.toaset(msg);
      return;
    }
    if (!this.bBtn) return;
    this.bBtn = false;

    this.request.post('3103', 'resetPwdByMobile', {mobile: this.login.mobile, password: md5(this.login.password), code: this.login.code}).then((res)=>{
      this.bBtn = true;

      if (res['code'] == '1000') {
        let toast = this.toastCtrl.create({
          message: '验证码已过期',
          duration: 2000,
          position: 'middle'
        });
        toast.present();
        return;
      } else if (!res['code']) {
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
        msg = res['msg'];
      }

      if (msg) {
        this.toaset(msg);
      }
    })
  }
  public toaset(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

}
