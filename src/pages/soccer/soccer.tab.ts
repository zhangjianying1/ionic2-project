import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {soccerUtil} from './../../utils/soccerUtil';
import {publicUtil} from '../../utils/publicutil';
import {SoccerService} from './soccer.service';

@Component({
  selector: 'soccer-tab',
  templateUrl: 'soccer.tab.html'
})
export class SoccerTab {
  constructor(
    private soccerService: SoccerService,
    private toastCtrl: ToastController
  ){}

  matchList : any = [];
  showMark : boolean = false;

  // 单选
  radioData = [{name: '全选',checked: true}, {name: '反选',checked: false}, {name: '五大联赛',checked: false}]
  playData = [{name: '全部玩法', active: true}, {name: '单关', active: false}]
  // 玩法切换标志
  showPlay =  {active: -1}
  matchName =  '全部联赛'
  playName = '全部玩法';
  toggleHandle(num: number){

    this.showPlay.active = num;

    if (this.matchList['length'] == 0) {
      let soccerList = publicUtil.store.getData('multiple');
      this.matchList = soccerUtil.filterPlay(soccerList);
    }

  }
  getShut(eare?: string, index?: number): void{
    let matchName: string;

    // 全部玩法 or 单关
    if (eare) {
      soccerUtil.listMap(this.playData, false);
      soccerUtil.listMap(this.playData, false, eare);
      this.playName = eare;

    }
    let soccerList = publicUtil.store.getData('multiple');

    let tempData = soccerUtil.filterShutData(soccerList, soccerUtil.filterData, eare || this.playName);

    // 没有相关比赛
    if (tempData.length < 1) {

      let toast = this.toastCtrl.create({
        message: '没有相关比赛',
        duration: 2000,
        position: 'center'
      });
      toast.present();
      return;
    } else {

      // 五大联赛
      if (soccerUtil.isfiveTeamAll()) {
        matchName = '五大联赛';
      } else {

        // 选择一种联赛
        if (soccerUtil.filterData.length == 1) {
          matchName = soccerUtil.filterData.toString();
        } else {
          matchName = '全部联赛';
        }

      }

      // 清空方案里面的数据
      soccerUtil.programmeData['multiple'] = [];
      this.matchName = matchName;
      this.soccerService.setSoccerData(tempData);
      this.closeView();
      this.soccerService.setDefaultProgrammeData();
    }

  }
  radioHandle(value, index){

    let eare = [],
      matchList = this.matchList,
      radioData = this.radioData;

    // 五大联赛


    if (value == '全选') {
      soccerUtil.listMap(matchList, true);


    } else if (value == '反选'){
      soccerUtil.reverseMap(matchList);


    } else {

      // 五大联赛
      soccerUtil.listMap(matchList, false);

      soccerUtil.fiveTeam.map(function(val){

        soccerUtil.listMap(matchList, false, val);
      })

    }
    eare = soccerUtil.foundName(matchList);
    soccerUtil.setFilterData(eare);

    radioData.map(function(re){
      re['checked'] = false;
    })
    radioData[index]['checked'] = true;

    console.log(matchList)
    this.matchList = matchList;
    this.radioData = radioData;

  }
  filterEare(name, index){
   let matchList = this.matchList;


    matchList[index].active = !matchList[index].active;
    // 组合过滤标签
    soccerUtil.setFilterData(name);

    // 全部选中则为全选
    if (soccerUtil.filterData.length == matchList.length) {
      this.radioData[0].checked = true;
    } else {
      this.radioData[0].checked = false;
    }

    // 五大联赛是否选中
    this.radioData[2].checked = soccerUtil.isfiveTeamAll();
  }


  public closeView(){
    this.showPlay.active = 0;
  }
}
