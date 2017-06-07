import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { ScoreComponent } from '../pages/score/score.component';
import { SoccerComponent } from '../pages/soccer/soccer';
import { SoccerOther } from '../pages/soccer/soccer.other.component';

import { Welcome } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import {HomeService} from '../pages/home/home.service';
import {HomeSoccerItemComponent} from '../pages/home/home.soccer.item.component';
import {TakeConfirmComponent} from '../pages/takeconfirm/take.confirm.component';
import { OrderPayment } from '../pages/orderpayment/order.payment.ts';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginIn } from '../pages/login/login.in';
import { Register } from '../pages/login/register';
import { ForgetPassword } from '../pages/login/forgetpassword';

import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Transfer } from '@ionic-native/transfer';
import { Network } from '@ionic-native/network';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';



import {SoccerTab} from '../pages/soccer/soccer.tab';
import {SoccerItem} from '../pages/soccer/soccer.item';
import {SoccerFooter} from '../pages/takeconfirm/soccer.footer.ts';
import {SoccerService} from '../pages/soccer/soccer.service';
import {TakeService} from '../pages/takeconfirm/take.service';

import { AppStore } from './app.service';
import {MyRadio} from '../pages/directives/input/radio';
import { CrossDirective } from '../pages/takeconfirm/directive/cross.directive';
import { KeyboardDirective } from '../pages/takeconfirm/directive/keyboard.directive';
import { TakeTips } from '../pages/directives/take/take.tips';

/* 充值 */
import { Recharge } from '../pages/prize/recharge';
import { WxRecharge } from '../pages/prize/wx.recharge';
import { ZfbRecharge } from '../pages/prize/zfb.recharge';
import { Draw } from '../pages/prize/draw';
import { Profile } from '../pages/prize/profile';

import { Request } from '../utils/request';

/* 个人中心 */
import { UserComponent } from '../pages/user/user.component';
import { AboutUs } from '../pages/user/aboutus/aboutus';
import { Capital} from '../pages/user/capital/capital';
import { Programme } from '../pages/user/programme/programme';
import { ProgrammeDetail } from '../pages/user/programme/programme.detail';

import { UserMsg } from '../pages/user/usermsg/usermsg';
import { RealName } from '../pages/user/usermsg/realname/realname';
import { Bank } from '../pages/user/usermsg/bank/bank';
import { ModifyPassword } from '../pages/user/usermsg/modifypassword/modify.password';

import { Picker } from '../pages/directives/picker/picker';

import { UserService } from '../pages/user/user.service';


import { MyPipeClass } from '../pages/pipes/clearfirst';
import { TransferData } from '../pages/pipes/transferdata';
import { StrEllipsis } from '../pages/pipes/strellipsis';
import { MobileEllipsis } from '../pages/pipes/mobileellipsis';
import { Card } from '../pages/pipes/card';

@NgModule({
  declarations: [
    MyApp,
    UserComponent,
    ScoreComponent,
    SoccerComponent,
    Welcome,
    HomePage,
    HomeSoccerItemComponent,
    LoginIn,
    TabsPage,
    SoccerTab,
    MyRadio,
    SoccerItem,
    SoccerFooter,
    Profile,
    CrossDirective,
    KeyboardDirective,
    TakeTips,
    TakeConfirmComponent,
    Register,
    ForgetPassword,
    OrderPayment,
    Recharge,
    WxRecharge,
    ZfbRecharge,
    Draw,
    AboutUs,
    SoccerOther,
    Capital,
    Programme, ProgrammeDetail,
    UserMsg, RealName, Bank, ModifyPassword, Picker,
    MyPipeClass, TransferData, StrEllipsis, MobileEllipsis, Card
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages: 'true', backButtonText: '', iconMode: 'ios',mode: 'ios'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScoreComponent,
    UserComponent,
    SoccerComponent,
    HomePage,
    Welcome,
    TabsPage,
    Profile,
    TakeConfirmComponent,
    LoginIn,
    Register,
    ForgetPassword,
    OrderPayment,
    Recharge,
    WxRecharge,
    ZfbRecharge,
    Draw,
    AboutUs,
    SoccerOther,
    Capital,
    Programme, ProgrammeDetail,
    UserMsg, RealName, Bank, ModifyPassword
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    CallNumber,
    InAppBrowser,
    AppStore,
    SoccerService,
    Request,
    FileOpener,
    File,
    Transfer,
    Network,
    HomeService,
    TakeService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {}
