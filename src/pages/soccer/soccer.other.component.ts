import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, ToastController} from 'ionic-angular';

import {publicUtil} from '../../utils/publicutil';
import { footballUtil } from '../../utils/footballutil';
import {soccerUtil} from  './../../utils/soccerUtil';
import {SoccerService} from './soccer.service';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'other',
  templateUrl: './soccer.other.html',

})
export class SoccerOther implements OnInit{

  constructor(
    private params: NavParams,
    private soccerService: SoccerService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private homeService: HomeService
  ){}

  public nameArray: any[] = [];

  public soccerResult: any;
  public sign: string;
  public getPos(): Array<number>{
    let index = this.params.get('index'),
      i = this.params.get('i');
    return [index, i];
  }
  ngOnInit(){

    let pos = this.getPos(),
      storeData: any;
    this.sign =  this.params.get('sign');

    if (this.sign == 'one') {
      storeData = this.homeService._soccerData[pos[0]].match[pos[1]];
    } else {
      storeData = this.soccerService._soccerData[pos[0]].match[pos[1]];
    }


    if (storeData['otherResult']) {
      this.nameArray = storeData['otherResult'].split(',');
    }

    this.soccerResult = this.serializeData(storeData, this.nameArray);
  }
  setDefaultActive(data, nameArray){

    if (!Array.isArray(data) || !Array.isArray(nameArray)) return data;
    soccerUtil.listMap(data, false);
    nameArray.map(function(name){

      soccerUtil.listMap(data, false, name);
    })
    return data;
  }
  /**
   * 序列化数据
   */
  serializeData(sourceData, nameArray): any{
    var tempData: any, tempArray = [], tempArray2 = [], tempArray3 = [];

    sourceData.dataList = [];
    tempData = Object.assign([], footballUtil['04']);


    tempData.map((val, index) => {

      val.map(function(o, i){

        if (index == 0) {
          o['sp'] = sourceData.scoreSp[i];

        } else if (index == 1) {
          o['sp'] = sourceData.scoreSp[13+ i];

        } else {
          o['sp'] = sourceData.scoreSp[18 + i];

        }
      })

      this.setDefaultActive(val, nameArray);
      tempArray.push(val);
    })
    sourceData.dataList.push({data: tempArray, name: '比分', value: 'scoreSp', active: true});


    // 总进球
    sourceData.totalSp.map((o, index) => {
      tempData = Object.assign({}, footballUtil['02'][index]);
      tempData['sp'] = o;
      tempArray2.push(tempData);
    })

    sourceData.dataList.push({data: this.setDefaultActive(tempArray2, nameArray), name: '总进球', value: 'totalGoalsSp', active: true});

    // 半全场
    sourceData.halfSp.map((o, index) => {
      tempData = Object.assign({}, footballUtil['03'][index]);
      tempData['sp'] = o;
      tempArray3.push(tempData);
    })

    sourceData.dataList.push({data: this.setDefaultActive(tempArray3, nameArray), name: '半全场', value: 'halfFullSp', active: true});

    return sourceData;
  }
  toggleShow(index){
    let soccerList = this.soccerResult.dataList;

    soccerList[index].active = !soccerList[index].active


  }

  /**
   * 对阵赛果选择
   */
  selectResult(wrapIndex, matchIndex, index, issue, single, sp, letBall, sn, sign, name, term, mainTeam, guestTeam, week, playId){
    let soccerList = this.soccerResult.dataList,
      tempData;


    // 0 =》 负 ； 1 =》 平 ； 3 =》 胜

    tempData = {
      single: single,
      issue: issue,
      sn: sn,
      termName: name,
      letBall: letBall,
      sign: sign,
      term: term,
      sp: sp,
      index: index,
      week: week,
      mainTeam: mainTeam,
      guestTeam: guestTeam,
      playId: playId
    }

    if (soccerUtil.setProgrammeData(this.sign, tempData) == -1) {
      let toast = this.toastCtrl.create({
        message: '对阵不能大于8个',
        position: 'middle',
        duration: 2000
      });
      toast.present();
      return;
    };

    // 比分
    if (matchIndex > -1) {
      tempData = soccerList[wrapIndex].data[matchIndex];
    } else {
      tempData = soccerList[wrapIndex].data;
    }

    tempData[index].active = !tempData[index].active;

    // 添加
    if (tempData[index].active) {
      this.nameArray.push(name);

    } else {
      this.nameArray.splice(publicUtil.isexits(this.nameArray, name), 1);
    }
    publicUtil.store.setData('orderId', '');

    //this.pos = [this.indexObj.wrapIndex, this.indexObj.index];
    isShowProgramme.bind(this)(soccerUtil.programmeData[this.sign]);

    function isShowProgramme(programmeData){

      var result = {};

      if (soccerUtil.isPass(programmeData)) {
        result = {name: '单关'};
      }
      result['len'] =  programmeData.length;

      if (this.sign == 'one') {
        this.homeService._programmeData['state'] = result;
      } else {
        this.soccerService._programmeData['state'] = result;
      }
      publicUtil.store.setData('orderId', '');
    }

  }

  /**
   * 确定赛果选择
   * @param sign {Number} 如果有值就是确定
   */
  confirm(sign?: number){
    let pos: Array<number>;

    if (sign) {
      pos = this.getPos();

      if (this.sign == 'one') {
        this.homeService._soccerData[pos[0]].match[pos[1]].otherResult = this.nameArray.toString();
      } else {
        this.soccerService._soccerData[pos[0]].match[pos[1]].otherResult = this.nameArray.toString();
      }
    }

    this.navCtrl.pop();

  }

}
