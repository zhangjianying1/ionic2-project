import { Component } from '@angular/core';
import {soccerUtil} from '../../../utils/soccerUtil';
import {TakeService} from '../../takeconfirm/take.service';


@Component({
  selector: 'keyboard',
  templateUrl: 'keyboard.directive.html'
})

export class KeyboardDirective{
  constructor(
    private takeService: TakeService
  ){}
  public multiple =  [{name: '10', active: false}, {name: '20', active: false}, {name: '30', active: false}, {name: '50', active: false}];
  private multipleArray: Array<any> = [];

  public closeView(){
    this.takeService._programmeData['multiple'].active = false;
  }

  /**
   *
   */
  selectMultiple(name?: string, index?: number) {
    let tempName: Array<any>;

    // 确定按钮
    if (name === undefined) {
      this.closeView();
      return;
    } else {
      tempName = name.toString().split('');

      // 最大倍数99倍
      if (name.length < 2 && this.multipleArray.length == 2) return;

      // 小键盘
      this.multipleArray = tempName.length > 1 ? tempName : this.multipleArray.concat(tempName);
    }

    this.changeMultiple(this.multipleArray);
  }
  /**
   * 改变倍数
   */
  changeMultiple(arr){

    let multiple = this.multiple, bonus: any,
      tempName = Number(arr.join(''));

    soccerUtil.listMap(multiple, false);
    soccerUtil.listMap(multiple, false, tempName);

    // 计算奖金
    bonus = soccerUtil.getPrice(this.takeService.getTakeData(), this.takeService._programmeData['cross'].name, tempName);
    this.takeService._programmeData['bonus'] = bonus;
    this.takeService._programmeData['multiple'].name = tempName;
  }
  /**
   * 小键盘删除
   */
  deleteNumber(){

    // 再次确定数据 （按钮点击时候产生二位的数字）
    // this.multipleArray = this.data.multiple.name.toString().split('');
    this.multipleArray.splice(this.multipleArray.length - 1, 1);
    // !this.multipleArray.length && (this.multipleArray = [1]);
    this.changeMultiple(this.multipleArray);
  }

}
