import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Request } from '../../../utils/request'
import { ProgrammeDetail } from './programme.detail';

class LoadData{
  public state: any = {};

  constructor(
    private request: Request
  ){}
  doLoad(data: Object){

    let sendData = data;


    if (!this.state[data['index']]) {
      this.state[data['index']] = 1;
    }
    if (sendData['page']) {
      this.state[data['index']]= 1;
    } else {
      this.state[data['index']] = this.state[data['index']] + 1;
      sendData['page'] = this.state[data['index']];
    }


    return new Promise((resolve, reject) => {
      this.request.post('3303', 'order', sendData).then((res) => {
        resolve(res);
      })
    })

  }
}

@Component({
  selector: 'programme-cont',
  templateUrl: 'programme.html'
})
export class Programme {
  public prograData: any = [];
  public nothing: boolean;
  public isFiniteScroll: boolean = true;
  public loadData = new LoadData(this.request);
  public index: number = 0;
  public state = {
    '0': {
      data: '',
      nothing: false
    },
    '1': {
      data: '',
      nothing: false

    },
    '2': {
      data: '',
      nothing: false

    }
  }
  constructor(
    private navCtrl: NavController,
    private request: Request
  ){}
  ngOnInit(){

    this.doRefresh('');
  }
  doRefresh(refresher?){


    let type = this.index == 1 ? '0' : this.index==2 ? '1' : '';
    this.loadData.doLoad({buyType: 1, bonusStatus: type, pageSize: 10, page: 1, index: this.index}).then((res) => {
      this.state[this.index].data = res['programsList'];

      if (res['programsList'] == 0) {
        this.state[this.index].nothing = true;
      }

      if (!this.isNoMore(res)) {
        this.isFiniteScroll = false
      } else {
        this.isFiniteScroll = true;
      }

      refresher && refresher.complete();
    });
  }
  doInfinite(infiniteScroll){

    let type = this.index == 1 ? '0' : this.index == 2 ? '1' : '';

    this.loadData.doLoad({buyType: 1, bonusStatus: type, pageSize: 10, index: this.index}).then((res) => {


      if (!res['code']) {
        this.state[this.index].data = this.state[this.index].data.concat(res['programsList']);


        if (!this.isNoMore(res)) {
          this.isFiniteScroll = false
        }
        infiniteScroll.complete();
      }


    });
  }
  isNoMore(data){
    return data.itemTotal > (data.page * data.pageSize);
  }
  goMore(programsOrderId){
    this.navCtrl.push(ProgrammeDetail, {programsOrderId: programsOrderId});
  }
  tabSelect(index){
    this.index = index;


    if (this.state[index].data.length == 0) {
      this.doRefresh();
    } else {
      this.isFiniteScroll = false;
      setTimeout(() => {
        this.isFiniteScroll = true;
      }, 2000)
    }
  }


}
