import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, NavController, NavParams } from 'ionic-angular';
import {TakeService} from '../takeconfirm/take.service';
import { OrderPayment } from '../orderpayment/order.payment'
import{ AppStore } from '../../app/app.service';
import {soccerUtil} from './../../utils/soccerUtil';
import { Request } from '../../utils/request';

@Component({
  selector: 'soccer-footer',
  templateUrl: 'soccer.footer.html',
  inputs: ['programmeData', 'sign', 'isOnePass']
})
export class SoccerFooter implements OnInit{


  public sign: string;
  constructor(
    private navCtrl: NavController,
    private takeService: TakeService,
    private appStoe: AppStore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private request: Request
  ){}

  ngOnInit(){
    this.sign = this.navParams.get('sign');
    this.takeService.setTakeData(soccerUtil.programmeData[this.sign]);
  }
  /**
   * 显示底部弹窗
   * @param sign
   */
  public showView(key: string){

    //if (key == 'cross' && this.takeService._programmeData['cross'].name.toString() == '单关') return;

    this.takeService._programmeData['multiple'].active = false;
    this.takeService._programmeData['cross'].active = false;
    this.takeService._programmeData[key].active = true;

    this.InitData(key, this.sign);

  }

  public InitData(key: string, sign: string){

    let len = this.takeService._programmeData.cross.len,
      takeService = this.takeService._programmeData,
      soccerCross = this.takeService._crossData;

    if (key == 'cross') {
      soccerCross.data = [];
      soccerCross.data[0] = soccerUtil.crossData[0].slice(0, len);

      // 多串数据
      if (len > 2) soccerCross.data[1] = soccerUtil.crossData[len-2];

      if (!soccerUtil.isPass(soccerUtil.programmeData[sign])) {
        soccerCross.data[0].splice(0, 1);
      }

      // 默认选中的高亮
      soccerCross.data.map(function(cross){
        soccerUtil.listMap(cross, false);

        takeService['cross']['name'].map(function(n){
          soccerUtil.listMap(cross, false, n);

        })
      })

      this.takeService.setCrossData(soccerCross);
    }
  }


  /**
   * 生成订单
   */
  commit(){


    let takeService = this.takeService._programmeData;

    // 倍数为零
    if (takeService['multiple'].name == 0) {
      let toast = this.toastCtrl.create({
        message: '倍数不能为零',
        duration: 2000
      });
      toast.present();
    } else {
      this.takeService._programmeData['multiple'].active = false;
      this.takeService._programmeData['cross'].active = false;
      this.navCtrl.push(OrderPayment, {sign: this.sign});
    }

  }


}

