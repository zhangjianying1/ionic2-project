import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SoccerOther } from './soccer.other.component';
@Component({
  selector: 'soccer-item',
  templateUrl: 'soccer.item.html',
  inputs: ['matchList', 'selectResult', 'toggleShow'],
  outputs: ['changed']
})
export class SoccerItem {
  constructor(
    private navCtrl: NavController
  ){}

  @Input()
  public sign
  /**
   * 更多赛果
   * @param index {Number}
   * @param i {Number}
   */
  public presentProfileModal(index, i) {
    console.log(this.sign);
    this.navCtrl.push(SoccerOther, { index: index, i: i, sign: this.sign});
  }


}
