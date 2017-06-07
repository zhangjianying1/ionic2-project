import { Component, Input } from '@angular/core';
import {NavController, ModalController } from 'ionic-angular';
import { TakeConfirmComponent } from '../../takeconfirm/take.confirm.component';
import { HomeService } from '../../home/home.service';
import { SoccerService } from '../../soccer/soccer.service';
import { AppStore } from '../../../app/app.service';
import { soccerUtil } from '../../../utils/soccerUtil';
import { LoginIn } from '../../login/login.in';

@Component({
  selector: 'take-tips',
  template: `<div class="take-tips" *ngIf=" cross && cross.len > 0">


      <div class="soccer-count">
        <div class="clear-soccer"><img src="./assets/images/delete.png" (click)="clearHandle()"/></div>
        <div *ngIf="cross.name == '单关'">
          <div class="has-count">已选{{cross.len}}场单关场次</div>
        </div>
         <div *ngIf="cross.name != '单关'">
          <div class="has-count">已选{{cross.len}}场</div>
          <div class="count-tips">至少选择2场</div>
        </div>
      </div>

      <div class="cofirm-count">
        <button (click)="takeHandle()" tappable class=" middle-btn" [ngClass]="(cross.name=='单关' || cross.len > 1) ? 'btn-primary' : 'btn-disabled'">投注</button>
      </div>


  </div>`,
  inputs: ['cross']
})
export class TakeTips{

  constructor(
    public navCtrl: NavController,
    public homeService: HomeService,
    public soccerService: SoccerService,
    public appStore: AppStore,
    public modalCtrl: ModalController
  ) {}
  @Input()
  public sign;
  @Input()
  public cross

  takeHandle(){

    if (this.cross.name == '单关' || this.cross.len > 1) {
      if (this.checkUserMsg()) {

        this.navCtrl.push(TakeConfirmComponent, {sign: this.sign});
      }
    }
  }

  clearHandle(){


    if (this.sign == 'one') {
      this.cancelSelected(this.homeService.getSoccerData());
      this.homeService.setDefaultProgrammeData()
    } else {
      this.cancelSelected(this.soccerService.getSoccerData());
      this.soccerService.setDefaultProgrammeData();
    }

    soccerUtil.programmeData[this.sign] = [];
  }
  cancelSelected(data){
    data.map((box) => {
      box.match.map((term) => {
        if (term.hasSelected) term.hasSelected = false;
        term.rqspfSp.map((item) => {
          item['active'] = false;
        })
        term.spfSp.map((item) => {
          item['active'] = false;
        })
        term['otherResult'] = '';
      })
    })
  }
  /**
   * 判断是否登录用户
   */
  public checkUserMsg() :boolean{
    let token = this.appStore._state['user'].token,
      bBtn: boolean = true;

    // 未登录
    if (!token) {
      bBtn = false;
      let profileModal = this.modalCtrl.create(LoginIn, {back: this.sign});
      profileModal.present();
    }
    return bBtn;
  }
}

