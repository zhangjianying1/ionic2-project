import { Component } from '@angular/core';
import { ToastController} from 'ionic-angular';
import {soccerUtil} from '../../../utils/soccerUtil';
import {TakeService} from '../../takeconfirm/take.service';

@Component({
  selector: 'cross',
  templateUrl: 'cross.directive.html'
})

export class CrossDirective{
  constructor(
    private takeService: TakeService,
    private toastCtrl: ToastController
  ){}


  public closeView(){
    this.takeService._programmeData['cross'].active = false;
  }

  /**
   * 选择过关方式
   */
  public selectCross(name, wrapIndex, index){
    let bonus: any,
      crossArray = [], bBtn = true,
      soccerStore = this.takeService._programmeData,
      crossData = this.takeService._crossData;

    crossArray = soccerUtil.foundName(crossData.data);


    // 单选
    if (wrapIndex == 1) {

      // 当前已经是选中(则是取消)
      if (crossData.data[wrapIndex][index].active) {
        bBtn = false;
      } else {
        soccerUtil.listMap(crossData.data[wrapIndex], false);
      }
    }  else {
      crossArray = soccerUtil.foundName(crossData.data[wrapIndex]);

      // 多选串关最多选3个
      if (crossArray.length == 3 && !crossData.data[wrapIndex][index].active) {

        let toast = this.toastCtrl.create({
          message: '串关方式不能大于3个',
          duration: 2000
        });
        toast.present();
        return;
      };

      // 最少选择一种过关方式
      if (crossArray.length == 1 && crossData.data[wrapIndex][index].active) {
        return;
      }
    }
    crossData.data[wrapIndex][index].active = bBtn ? !crossData.data[wrapIndex][index].active : bBtn;

    crossArray = soccerUtil.foundName(crossData.data);

    let tempCross = [];
    crossArray.map((item) => {
      let re =  /(串|\s串\s)/g;

      if (item == '单关') {
        item = '1*1';
      } else {
        item = item.replace(re, '*');
      }
      tempCross.push(item);
    });

    // 计算奖金
    bonus = soccerUtil.getPrice(this.takeService.getTakeData(), tempCross, soccerStore['multiple'].name);
    soccerStore['bonus'] = bonus;
    soccerStore['cross'].name = crossArray;

  }
}
