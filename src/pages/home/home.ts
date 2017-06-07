import { Component, OnInit } from '@angular/core';
import {NavController, ViewController, NavParams, ModalController, ToastController } from 'ionic-angular';

import {publicUtil} from '../../utils/publicutil';
import {soccerUtil} from  '../../utils/soccerUtil';
import {HomeService} from './home.service';
import { TakeService } from '../takeconfirm/take.service';
import { Request } from '../../utils/request';
import { Profile } from '../prize/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public sign: string;
  public isPlusSp: boolean;
  public adList: any = [];
  constructor(
    public navCtrl: NavController,
    public homeService: HomeService,
    public modalCtrl: ModalController,
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
      this.isShowProgramme(soccerUtil.programmeData['one']);
    }

  }
  ionViewWillEnter(){
    this.sign = 'one';
    this.isPlus(this.homeService._soccerData);
  }
  clearData(){
    soccerUtil.programmeData['one'] = [];
    this.homeService.setDefaultProgrammeData();
    this.takeService.setDefaultProgrammeData();
  }
  ngOnInit(){

    this.doRefersh();

    this.request.post('4000', 'index').then((res) => {
      if (!res['code']) {
        this.adList = res['adList'];
      }
    })
  }
  doRefersh(refresher?: any){
    if (refresher && soccerUtil.programmeData['one'].length > 0) return;
    this.request.post('3302', 'index').then((res) => {

      if (!res['code']) {
        let matchList = res['matchList'];
        soccerUtil.serializeSoccerData(matchList);
        publicUtil.store.setData('one', matchList);
        this.homeService.setSoccerData(matchList);

        this.clearData();

        // 是否是加奖
        this.isPlus(matchList);
      }

      refresher && refresher.complete();
    })

  }
  public isPlus(matchList){
    matchList.map((match) => {
      if (match.isPlusSp) {
        this.isPlusSp = true;
      }
    })
  }

  public selectResult (wrapIndex, matchIndex, index, issue, single, sp, plusResult, sn, sign, termName, mainTeam, guestTeam, week, playId, isPlus){


    // 0 =》 负 ； 1 =》 平 ； 3 =》 胜
    let tempData = {

      single: single,
      issue: issue,
      sn: sn,
      plusResult: plusResult,
      sign: sign,
      term: index == 0 ? 3 : index == 2 ? 0 : index,
      sp: sp,
      index: index,
      termName: termName,
      mainTeam: mainTeam,
      guestTeam: guestTeam,
      week: week,
      playId: playId,
      isPlus: isPlus
    };





    if (soccerUtil.setProgrammeData('one', tempData) == -1) {
      let toast = this.toastCtrl.create({
        message: '对阵不能大于8个',
        position: 'middle',
        duration: 2000
      });
      toast.present();
      return;
    };

    this.homeService._soccerData[wrapIndex]['match'][matchIndex][sign][index]['active'] = !this.homeService._soccerData[wrapIndex]['match'][matchIndex][sign][index]['active']


    this.isShowProgramme(soccerUtil.programmeData['one']);


    this.homeService._soccerData[wrapIndex]['match'][matchIndex].hasSelected = isShowPlus(this.homeService._soccerData[wrapIndex]['match'][matchIndex]);




    function isShowPlus(data): boolean{
      let bBtn = false;

      data['rqspfSp'].map((item) => {

        if (item.active) {
          bBtn = true;
        }
      })
      data['spfSp'].map((item) => {

        if (item.active) {
          bBtn = true;
        }
      })
      return bBtn;
    }

  }

  public toggleShow(index){
    let matchList = this.homeService._soccerData;
    matchList[index].active = !matchList[index].active;

  }
  public goDetail(h5Url, title){
    this.presentProfileModal(h5Url, title);
  }
  presentProfileModal(payUrl, title) {
    let profileModal = this.modalCtrl.create(Profile, { payUrl: payUrl, title: title });
    profileModal.present();
  }
  isShowProgramme(programmeData){

    var result = {};

    if (soccerUtil.isPass(programmeData)) {
      result = {name: ['单关']};
    } else {
      result = {name: [programmeData.length +' 串 1']};
    }
    result['len'] =  programmeData.length;
    this.homeService._programmeData['cross'] = result;
    publicUtil.store.setData('orderId', '');
  }

}

