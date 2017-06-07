import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, NavController, NavParams, ModalController} from 'ionic-angular';
import { publicUtil } from '../../utils/publicutil';
import {TakeService} from '../takeconfirm/take.service';
import { HomeService } from '../home/home.service';
import { SoccerService } from '../soccer/soccer.service';
import {AppStore} from '../../app/app.service';
import { Request } from '../../utils/request';
import { Recharge } from '../prize/recharge';
import { soccerUtil } from '../../utils/soccerUtil';
import { HomePage } from '../home/home';
import { LoginIn } from '../login/login.in';
import { SoccerComponent } from '../soccer/soccer';

@Component({
  selector: 'order-payment',
  templateUrl: 'order.payment.html'
})
export class OrderPayment implements OnInit{
  public orderData: any;
  public programmeData: any;
  public sign: string;
  constructor(
    private navCtrl: NavController,
    private takeService: TakeService,
    private homeService: HomeService,
    private soccerService: SoccerService,
    private request: Request,
    private appStore: AppStore,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ){}

  ngOnInit(){
    this.orderData = this.takeService.getTakeData();
    this.programmeData = this.takeService._programmeData;

    this.programmeData.item = (this.programmeData.bonus.amount/this.programmeData.multiple.name/2);

    this.programmeData.playId =  this.getPlay(this.orderData);
    this.sign = this.navParams.get('sign');


  }
   getPlay(data){
     let playId: any;
     let result: Array<string> = [];

    data.map((box) => {

      if (box.resultList.length > 1) {
        playId = '10';
      } else {

        if (!playId) {
          result.push(box.resultList[0]['playId']);
        }

      }
    })

    if (playId) {
      return playId;
    } else {
      if (!isEverySome(result)) {
        return '10';
      } else {
        return result[0];
      }
    }

    function isEverySome(arr: Array<string>): boolean{
      let result = true;

      arr.map((item, index) => {


        (index < arr.length) && arr.slice(index+1).map((o) => {
          if (item != o) {
            result = false;
          }
        })
      })
      return result;
    }
  }
  /**
   * 判断用户
   */
  public checkUserMsg() :boolean{
    let userMsg = this.appStore.get('user'),
      bBtn: boolean = true;

    // 余额不足
    if ((this.programmeData['bonus']['amount'] > (userMsg.cashAmount + userMsg.presentAmount)) && (userMsg.rechargeSwitch == 0)) {
      bBtn = false;
      let alert = this.alertCtrl.create({
        title: '',
        message: '您需补足<span class="c-red">' + (Number(this.programmeData['bonus']['amount']) - Number(userMsg.cashAmount)) + '元</span>余额，是否前去充值?',
        buttons: [
          {
            text: '取消',
            cssClass: 'cancel-btn',
            handler: () => {
              console.log('取消');
            }
          },
          {
            text: '充值',
            handler: () => {
              this.navCtrl.push(Recharge, {back: 'take'});
            }
          }
        ]
      });
      alert.present();

    }
    return bBtn;
  }

  /**
   * 生成订单
   */
  paymentHandle(){

    let crossName = this.programmeData['cross'].name.toString().replace(/单关/g, '1*1').replace(/(串|\s[\u4e00-\u9fa5]\s)/g, '*');

      if (this.checkUserMsg()) {
        confirmCommit.bind(this)();
      }

    function confirmCommit(){
      var result = [],
        key: string,
        orderId: any = publicUtil.store.getData('orderId');


      // 重复订单
      if (orderId) {
        let toast = this.toastCtrl.create({
          message: '订单重复',
          position: 'middle',
          duration: 2000
        });
        toast.present();
        return;
      }
      key =  Math.random().toString();


      result.push({
        buyNumber: getNumber.bind(this)(this.orderData),
        playId: this.programmeData.playId, //过关方式
        pollId: crossName == '1*1' ? '01' : '02',  // 单关 => 01 串关和单关混合 02
        multiple: '1',
        amount: this.programmeData['bonus'].amount,
        item: this.programmeData['bonus'].amount/2/this.programmeData['multiple'].name,
      })

      let buyPrice =  orderAmountHandle.bind(this)(result[0].amount);


      this.request.post(
        '3300',
        'sports',
        {
          "expectBonus": this.programmeData['bonus'].bonus,
          "avgAmount": '0',
          "buyAmount": result[0].amount,
          "buyNumber": result,
          "buyType": '1',
          "buyWere": '0',
          "commision": '0',
          "description": "",
          "issue": [
            {
              "issue": getIssue(this.orderData),
              "multiple": this.programmeData['multiple'].name
            }
          ],
          "lastAmount": '0',
          "lastWere": '0',
          "lotteryId": "200",
          "optimizeType": isPlusAmount.bind(this)(this.orderData),
          "outOrderId": key,
          "payStruct": buyPrice,
          "playId": this.programmeData.playId,
          "privacy": '0',
          "stopAmount": '0',
          "totalAmount": result[0].amount,
          "totalCount": '0',
          "totalWere": '0',
          "wereMin": '0',
          "winStop": '1'
        }
      )
        .then((res) => {

          // 用户未登录
          if (res['code'] == '0008') {

            let profileModal = this.modalCtrl.create(LoginIn, {back: 'orderpayment'});
            profileModal.present();
            return;
          }

          if (!res['code']) {
            publicUtil.store.setData('orderId', key);


            if (buyPrice.present) {
              this.appStore._state['user'].presentAmount = this.appStore._state['user'].presentAmount - buyPrice.presetAmount;
            }
            this.appStore._state['user'].cashAmount = this.appStore._state['user'].cashAmount - buyPrice.cashAmount;
            let target;

            if (this.sign == 'one') {
              target = HomePage;
            } else {
              target = SoccerComponent;
            }

            let alert = this.alertCtrl.create({
              title: '',
              message: '订单提交成功',
              buttons: [

                {
                  text: '继续购彩',
                  cssClass: 'confirm-full',
                  handler: () => {
                    this.navCtrl.setPages([{
                      page: target,
                      params: {clear: true}
                    }])
                  }
                }
              ]
            });
            alert.present();
          } else {
            this.toastCtrl.create({
              message: res['msg'],
              duration: 2000,
              position: 'middle'
            }).present();
            return;
          }


        })

    }

    /**
     * 是否加奖
     */
    function isPlusAmount(data){

      var result = 0;
      data.map((box) => {
        box.resultList.map((term) => {
          term.termList.map((item) => {
            if (item.isPlus == -1) {
              result = -1;
            };
          })

        })
      })
      return result;
    }
    function getIssue(data){
      var temp = [];
      data.map((box) => {
        box.resultList.map((term) => {
          temp.push(term.issue);
        })
      })
      return Math.max.apply(null, temp);
    }
    function orderAmountHandle(orderAmount){
      let userMsg = this.appStore.get('user'),
        cashAmount: number, presetAmount: number;

      if (userMsg.cashAmount < orderAmount) {
        cashAmount = userMsg.cashAmount;
        presetAmount = orderAmount -cashAmount;
      } else {
        cashAmount = orderAmount;
        presetAmount = 0;
      }

      return {
        "cashAmount": cashAmount,
        "presentAmount": presetAmount,
        "priority": 1
      }
    }
    function getNumber(data) {
      var result = '';

      soccerUtil.sortProgrammeData(data).map( (programme) => {

        // 遍历resultList
        programme.resultList.map((val) => {
          result += ';'
          result += val.issue + val.sn + ':';

          if (this.programmeData.playId == '10') {
            if (val.sign == 'spfSp') {
              result += '05'
            } else if (val.sign == 'rqspfSp') {
              result += '01'
            } else if (val.sign == 'halfFullSp') {
              result += '03'
            } else  if (val.sign == 'totalGoalsSp') {
              result += '02'
            } else if (val.sign == 'scoreSp') {
              result += '04'
            }
            result += ':';
          }

          // 遍历对阵的多种赛果
          val.termList.map((term) => {
            result += term.term + ',';
          })
          result = result.slice(0, -1);

          // 不是混合过关
          if (this.programmeData.playId != '10') {
            result += ':0';
          }

        })
      })
      result = result.substring(1);
      result += '|' + crossName;

      return result;
    }

    //{
    //  "avgAmount": 0默认,
    //  "buyAmount": 6,
    //  "buyNumber": [
    //  {
    //    "amount": 6,
    //    "buyNumber": "20170511003:05:3,1,0;20170511004:01:3|2*1",
    //    "item": 3,
    //    "multiple": 1默认,
    //    "playId": "10",
    //    "pollId": "02"
    //  }
    //],
    //  "buyType": 1默认,
    //  "buyWere": 0默认,
    //  "commision": 0默认,
    //  "description": ""默认,
    //  "issue": [
    //  {
    //    "issue": "20170511",
    //    "multiple": 1
    //  }
    //],
    //  "lastAmount": 0默认,
    //  "lastWere": 0默认,
    //  "lotteryId": "200",
    //  "optimizeType": "0"默认,
    //  "outOrderId": "20170509143708598",
    //  "payStruct": {
    //  "cashAmount": 6.0,
    //    "presentAmount": 0.0,
    //    "priority": 1默认
    //},
    //  "playId": "10",
    //  "privacy": 0默认,
    //  "stopAmount": 0默认,
    //  "totalAmount": 6,
    //  "totalCount": 0默认,
    //  "totalWere": 0默认,
    //  "wereMin": 0默认,
    //  "winStop": 1默认
    //}

  }

}
