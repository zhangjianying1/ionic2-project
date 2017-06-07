import { Component } from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';

import { TakeService } from './take.service';
import { SoccerService } from '../soccer/soccer.service';
import { HomeService } from '../home/home.service';
import {soccerUtil} from  '../../utils/soccerUtil';
import { publicUtil } from '../../utils/publicutil';
import { SoccerOther } from '../soccer/soccer.other.component';
@Component({
  selector: 'take-confirm',
  templateUrl: 'take.confirm.component.html'
})
export class TakeConfirmComponent {
  public sign: string;
  public pageData: any;
  public programmeData: any;
  public isOnePass: boolean;
  public
  constructor(
    public takeService: TakeService,
    public homeService: HomeService,
    public soccerService: SoccerService,
    public navParams: NavParams,
    public navCtrl: NavController
  ) {}

  ionViewWillEnter(){

    this.sign = this.navParams.get('sign');

    this.pageData = this.serializeData(this.sign == 'one' ? this.homeService._soccerData : this.soccerService._soccerData);
    this.programmeData = this.sign == 'one' ? this.homeService._programmeData : this.soccerService._programmeData;
    this.takeService.setkey('cross', this.programmeData.cross);

    this.isOnePass = soccerUtil.isPass(soccerUtil.programmeData[this.sign]);
    this.calcuator(this.programmeData.cross.name);
    console.log(this.pageData)
  }

  /**
   * 处理页面数据
   * @param data
   * @returns {any}
   */
  serializeData(data){



    data.map((match) => {


      match.match.map((term) => {
        let bBtnSPF: boolean = false;
        let bBtnRQSPF: boolean = false;
        term['spfSp'].map((item) => {

          if (item.active) {
            bBtnSPF = true;
          }
        })
        term['rqspfSp'].map((item) => {

          if (item.active) {
            bBtnRQSPF = true;
          }
        })
        term['staySPF'] = false;
        term['stayRQSPF'] = false;
        if ( ((term.otherResult || bBtnRQSPF) && this.sign == 'multiple') || (this.sign == 'one' && bBtnRQSPF) ) {
          term['stayRQSPF'] = true;
        }

        if ( ((term.otherResult || bBtnSPF) && this.sign == 'multiple') || (this.sign == 'one' && bBtnSPF) ) {
          term['staySPF'] = true;
        }
      })

    })

    return data;
  }
  public selectResult (wrapIndex, matchIndex, index, issue, single, sp, plusResult, sn, sign, termName, mainTeam, guestTeam, week, playId, isPlus){


    let matchList = this.pageData,
      target = this.sign == 'one' ? 'one' : 'multiple';

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
      week: week,
      termName: termName,
      mainTeam: mainTeam,
      guestTeam: guestTeam,
      playId: playId,
      isPlus: isPlus
    };


    // 最少要选择一个赛果
    if (soccerUtil.programmeData[target].length == 1
      && soccerUtil.programmeData[target][0].resultList.length == 1
      && soccerUtil.programmeData[target][0].resultList[0].termList.length == 1
      && matchList[wrapIndex]['match'][matchIndex][sign][index]['active'] ) return;

    soccerUtil.setProgrammeData(target, tempData);
    matchList[wrapIndex]['match'][matchIndex][sign][index]['active'] = !matchList[wrapIndex]['match'][matchIndex][sign][index]['active']

    this.homeService._soccerData[wrapIndex]['match'][matchIndex].hasSelected = isShowPlus(this.homeService._soccerData[wrapIndex]['match'][matchIndex]);
    isShowProgramme.bind(this)(soccerUtil.programmeData[target]);

    function isShowProgramme(programmeData){



      var result = {},
        len = this.getCrossLen(soccerUtil.programmeData[this.sign]);

      if (soccerUtil.isPass(programmeData)) {
        result = {name: ['单关']};
      } else {
        result = {name: [len +' 串 1']};
      }
      result['len'] =  len;
      this.programmeData['cross'] = result;
      this.takeService.setkey('cross', result);
      publicUtil.store.setData('orderId', '');
      this.calcuator(result['name']);
    }

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
  public calcuator(crossArray?: Array<string>){
    let len = 0;
    let bonus = {};

    len = this.getCrossLen(soccerUtil.programmeData[this.sign]);


    this.takeService._programmeData['multiple']['name'] = this.takeService._programmeData['multiple']['name'] || 1;
    this.takeService._programmeData['active'] = true;
    this.takeService._programmeData['len'] = len;


    bonus = soccerUtil.getPrice(soccerUtil.programmeData[this.sign], crossArray, this.takeService._programmeData['multiple']['name']);


    this.takeService._programmeData.bonus = bonus;
    this.takeService._takeData = soccerUtil.programmeData[this.sign];
    /**
     * 取串关方式的节点索引
     * @param data
     */


  }
  getCrossLen(data): number{
    let len: number = 8;

    if (data.length < 5) return data.length;

    data.map((box) => {
      box['resultList'].map((term) => {

        if (term.playId == '04') {
          len = 4;
        } else if (term.playId == '03' || term.playId == '02') {

          if (len != 4) len = 6;
        }

      })
    })
    return len;
  }
  /**
   * 更多赛果
   * @param index {Number}
   * @param i {Number}
   */
  public presentProfileModal(index, i) {
    this.navCtrl.push(SoccerOther, { index: index, i: i, sign: this.sign});
  }

}

