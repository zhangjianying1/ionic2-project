import { Component} from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { Request } from '../../utils/request';
import { md5 } from '../../utils/md5';
import { publicUtil } from '../../utils/publicutil';
import { AppStore } from '../../app/app.service';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'register',
  templateUrl: 'register.html'
})
export class Register {
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
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController
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
    // 发验证码
    if (!this.login.isSendCode){
      this.request.post('3105', 'mobileRegister', {mobile: this.login.mobile}).then((res)=>{
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
      this.toast(msg);
    }
    if (!this.bBtn) return;
    this.bBtn = false;

    this.request.post('3100', 'mobile', {mobile: this.login.mobile, password: md5(this.login.password), code: this.login.code}).then((res)=>{

      this.bBtn = true;
       //验证码过期
      if (res['code'] == '1031') {
        msg = '验证码过期';
        return;
      } else if (res['code'] == '0999') {
        msg = '注册失败'
      } else if (!res['code']) {

        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: '注册成功'
        });

        loading.present();

        setTimeout(() => {
          let back = this.navParams.get('back'),
            index: number;

          // 首页
          if (back == 'one') {
            index = 0;
          } else if (back == 'multiple') {
            index = 1;
          } else if (back == 'user') {
            index = 3;
          }
          this.navCtrl.setRoot(TabsPage,{index: index}, {}, () => {

          });

        }, 1000);

        setTimeout(() => {
          loading.dismiss();
        }, 1000);

        this.appStore.set('user', res);
        publicUtil.store.setData('token', res['token']);
        publicUtil.store.setData('userName', this.login.mobile);
        publicUtil.store.setData('password', this.login.password);



      } else {
        msg = res['msg'];
      }

      if (msg) {
        this.toast(msg);
      }

    })
  }
  toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
    return;
  }

}
