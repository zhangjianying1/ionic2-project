import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, LoadingController, ToastController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { publicUtil } from '../utils/publicutil';
import { FileOpener } from '@ionic-native/file-opener';
import { Request } from '../utils/request';
import { md5 } from '../utils/md5';
import { TabsPage } from '../pages/tabs/tabs';
import { AppStore } from '../app/app.service';
import { Welcome } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = '';
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  @ViewChild('myNav') nav: Nav;
  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private device: Device,
              private request: Request,
              private fileOpener: FileOpener,
              private file: File,
              private transfer: Transfer,
              private appStore: AppStore,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();

      let userName =  publicUtil.store.getData('userName'),
        password =  publicUtil.store.getData('password'),
        re = /^1[23456789][\d]{9}/, func = 'userName';

      // 手机号
      if (re.test(userName)) {
        func = 'mobile';
      }

      if (userName && password) {
        // 自动登录
        this.request.post('3101', func, {[func]: userName, password: md5(password.toString())}).then((res) => {

          if (res['token']) {

            this.appStore.set('user', res);
            publicUtil.store.setData('token', res['token']);
          }
        })
      }
      this.listenExit();
      this.isStart();
    });
  }
  public isStart(){

    if (publicUtil.store.getData('start')) {
      this.rootPage = TabsPage;

      if (this.platform.is("android")) {
        this.update();
      }
    } else {
      this.rootPage = Welcome;
    }

  }
  public listenExit(){
    this.platform.registerBackButtonAction(() => {

      let activeVC = this.nav.getActive();
      let page = activeVC.instance;
      if (!(page instanceof TabsPage)) {
        if (!this.nav.canGoBack()) {
          //当前页面为tabs，退出APP
          return this.showExit();
        }
        //当前页面为tabs的子页面，正常返回
        return this.nav.pop();
      }
      let tabs = page.tabs;
      let activeNav = tabs.getSelected();
      if (!activeNav.canGoBack()) {
        //当前页面为tab栏，退出APP
        return this.showExit();
      } else {
        //当前页面为tab栏的子页面，正常返回
        return activeNav.pop();
      }

    }, 1);
  }
  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'middle'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
  public fileTransfer = this.transfer.create();
  public update(){

    this.request.post('3000', 'version').then((res) => {

      if (res['status'] == 2) {
        let alert = this.alertCtrl.create({
          title: '版本更新',
          message: res['updateInfo'],
          buttons: [
            {
              text: '取消',
              role: 'cancel',
              cssClass: 'cancel-btn',
              handler: () => {
                console.log('取消');
              }
            },
            {
              text: '更新',
              handler: () => {
                console.log('更新');
                updateHandle.bind(this)();
              }
            }
          ]
        });
        alert.present();
      } else if (res['status'] == 3) {  //    强制更新
        let alert = this.alertCtrl.create({
          title: '版本更新',
          message: res['updateInfo'],
          buttons: [
            {
              text: '更新',
              cssClass: 'confirm-full',
              handler: () => {

                updateHandle.bind(this)();
              }
            }
          ]
        });
        alert.present();

      }
    })

    function updateHandle(res) {

      let loading = this.loadingCtrl.create({
          spinner: 'ios',
          content: '安装包正在下载...',
          dismissOnPageChange: false
      }), target: any;

      loading.present();
      if (!this.file.externalRootDirectory) {
        target = this.file.dataDirectory;
      } else {
        target = this.file.externalRootDirectory;
      }

      this.file.checkDir(target, 'caitong')
        .then(_ => {
          this.downloadAPK(res, loading);

        })
        .catch(err => {

          this.file.createDir(target, "caitong", false)
            .then( _ => {
              this.downloadAPK(res, loading);

            }, function (error) {
              alert(JSON.stringify(error));
            });

        })
    }
  }



  public downloadAPK(res, loading){
    let url = 'http://newapp.icaimi.com/apk/android.apk' || res.downUrl,
      target: any;
    if (!this.file.externalRootDirectory) {
      target = this.file.dataDirectory;
    } else {
      target = this.file.externalRootDirectory;
    }

    let targetPath = target + '/caitong/com.caitong.lottery.apk';

    // 下载
    this.fileTransfer.download(url, targetPath).then((entry) => {

      loading.dismiss();
      this.fileOpener.open(targetPath, 'application/vnd.android.package-archive').then(()=>{
        publicUtil.store.setData('start', false);
      });
    }, (error) => {
      alert('下载失败')
      loading.dismiss();
    });
    // 进度
    this.fileTransfer.onProgress((event) => {
      let timer = null;

      //进度，这里使用文字显示下载百分比
      var downloadProgress = (event.loaded / event.total) * 100;
      loading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
      if (downloadProgress > 1) {
        timer = setInterval(()=> {
          loading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
        }, 4000)
      }
      if (downloadProgress > 99) {
        clearInterval(timer);
        loading.dismiss();
      }
    });
  }

}
