import { Component, OnInit } from '@angular/core';
import {NavParams, NavController, ViewController, ToastController} from 'ionic-angular';

import {publicUtil} from '../../utils/publicutil';
import {soccerUtil} from  './../../utils/soccerUtil';
import {SoccerService} from './soccer.service';
import { TakeService } from '../takeconfirm/take.service';
import { Request } from '../../utils/request';

@Component({
  selector: 'soccer-content',
  templateUrl: 'soccer.html'
})
export class SoccerComponent implements OnInit {

  public sign: string;
  constructor(
    public navCtrl: NavController,
    public soccerService: SoccerService,
    public request: Request,
    private viewCtrl: ViewController,
    public navParams: NavParams,
    public takeService: TakeService,
    public toastCtrl: ToastController
  ) {
    viewCtrl.willEnter.subscribe(this.initData.bind(this));
  }
  initData(){

    let clear = publicUtil.store.getData('orderId');

    if (clear) {
      // 清空投注缓存记录
      this.clearData();
      this.doRefersh();
    } else {
      this.isShowProgramme(soccerUtil.programmeData['multiple']);
    }

  }
  clearData(){
    soccerUtil.programmeData['multiple'] = [];
    this.soccerService.setDefaultProgrammeData();
    this.takeService.setDefaultProgrammeData();
  }
  ngOnInit(){
    let clear = this.navParams.get('clear');
    this.sign = 'multiple';

    (clear || typeof clear == 'undefined') && this.doRefersh();
  }

  doRefersh(refresher?){
    if (!refresher && soccerUtil.programmeData['multiple'].length > 0) return;
    this.request.post('3302', '', {lotteryId: 200}).then((res) => {

      if (!res['code']) {
        let matchList = res['matchList'];
        soccerUtil.serializeSoccerData(matchList);
        publicUtil.store.setData('multiple', matchList);
        this.soccerService.setSoccerData(matchList);
        this.clearData();
      }
      refresher && refresher.complete();

    })


  }
  public selectResult (wrapIndex, matchIndex, index, issue, single, sp, letBall, sn, sign, termName, mainTeam, guestTeam, week, playId){


    let matchList = this.soccerService._soccerData;

    // 0 =》 负 ； 1 =》 平 ； 3 =》 胜
    let tempData = {

      single: single,
      issue: issue,
      sn: sn,
      letBall: letBall,
      sign: sign,
      term: index == 0 ? 3 : index == 2 ? 0 : index,
      sp: sp,
      index: index,
      week: week,
      termName: termName,
      mainTeam: mainTeam,
      guestTeam: guestTeam,
      playId: playId
    };

    if (soccerUtil.setProgrammeData('multiple', tempData) == -1) {
      let toast = this.toastCtrl.create({
        message: '对阵不能大于8个',
        position: 'middle',
        duration: 2000
      });
      toast.present();
      return;
    }

    matchList[wrapIndex]['match'][matchIndex][sign][index]['active'] = !matchList[wrapIndex]['match'][matchIndex][sign][index]['active']

    this.isShowProgramme(soccerUtil.programmeData['multiple']);





  }
  isShowProgramme(programmeData){

    var result = {};

    if (soccerUtil.isPass(programmeData)) {
      result = {name: ['单关']};
    } else {
      result = {name: [programmeData.length +' 串 1']};
    }
    result['len'] =  programmeData.length;
    this.soccerService._programmeData['cross'] = result;
    publicUtil.store.setData('orderId', '');
  }

  public toggleShow(index){
    let matchList = this.soccerService._soccerData;
    matchList[index].active = !matchList[index].active;

  }

}

