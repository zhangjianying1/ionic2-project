import { Component } from '@angular/core';
import { Platform, ToastController, AlertController, NavController } from 'ionic-angular';
import {TakeService} from '../takeconfirm/take.service';
import { LoginIn } from '../login/login.in';
import{ AppStore } from '../../app/app.service';
import {soccerUtil} from './../../utils/soccerUtil';
import {publicUtil} from '../../utils/publicutil';


@Component({
  selector: 'capital-wx',
  templateUrl: 'wx.recharge.html'
})
export class WxRecharge {
  constructor(
    private navCtrl: NavController,
    private takeService: TakeService,
    private appStoe: AppStore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ){}
  public price: any;
  public rechargeHandle(){

  }
}
