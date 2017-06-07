import { Component} from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { Request } from '../../utils/request';
import { md5 } from '../../utils/md5';
import { publicUtil } from '../../utils/publicutil';
import { AppStore } from '../../app/app.service';
import { Register } from './register';
import { ForgetPassword } from './forgetpassword';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'login-in',
  templateUrl: 'login.in.html'
})
export class LoginIn {
  public isLock: boolean = false;
  public login: any = {
    userName:   publicUtil.store.getData('userName'),
    password: publicUtil.store.getData('password'),
    isRemember: true
  };
  public back: any;
  public bBtn: boolean = true;
  constructor(
    public navCtrl: NavController,
    public request: Request,
    public appStore: AppStore,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public appCtrl: App
  ) {
    this.back = navParams.get('back');
  }
  ionViewWillLeave(){
    //console.log(this.appCtrl.getRootNav());
    //alert(3);
  }
  closeHandle(){
    if (this.navParams.get('back') == 'user') {

      this.navCtrl.setRoot(TabsPage, {index: 0});
    } else {
      this.navCtrl.pop();
    }
  }

  /**
   * 是否记住密码
   */
  checkHandle() {

    this.login['isRemember'] = !this.login['isRemember'];

  }
  loginHandle(){
    let msg: string,
      re = /^1[23456789][\d]{9}/, func = 'userName', spaceRE = /\S/g;

    if (!spaceRE.test(this.login.userName)) {
      msg = '手机号不能为空';

      if (!re.test(this.login.mobile)) {
        msg = '手机号不正确';
      }
    } else if (!spaceRE.test(this.login.password)) {
      msg = '密码不能为空';
    }

    if (msg) {
      this.toast(msg);
      return;
    }

    // 手机号
    if (re.test(this.login.userName)) {
      func = 'mobile';

    }
    if (!this.bBtn) return;
    this.bBtn = false;
    this.request.post('3101', func, {[func]: this.login.userName, password: md5(this.login.password.toString())}).then((res)=>{

      let msg: string;
      this.bBtn = true;

      // 用户名不存在
      if (res['code'] == '1000') {
        msg = '用户名不存在';

      } else if (res['code'] == '1007') {
        msg = '密码不正确';

        if (res['result'].count == 1) {
          this.isLock = true;
        }
      } else if (res['code'] == '1023') {
        msg = '用户已被锁定';
      } else if (!res['code']) {
        this.appStore.set('user', res);
        publicUtil.store.setData('token', res['token']);

        if (this.login.isRemember) {
          publicUtil.store.setData('userName', this.login.userName);
          publicUtil.store.setData('password', this.login.password);
        }

        if (this.navParams.get('back') == 'user') {
          this.navCtrl.setRoot(TabsPage, {index: 3});
        } else {
          this.navCtrl.pop();
        }
      } else {
        msg = res['msg'];
      }

      if (msg) {
       this.toast(msg);
      }


    })
  }
  goRegister(){
    this.navCtrl.push(Register, {back: this.back});
  }
  forgetPassword(){
    this.navCtrl.push(ForgetPassword, {back: this.back});
  }
  toast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'center',
      duration: 2000
    });
    toast.present();
  }

}
