import { Component, OnInit } from '@angular/core';
import { Request } from '../../../utils/request';
class LoadData{
  public page: any = {};

  constructor(
    private request: Request
  ){}
  doLoad(data: Object){

    let sendData = data;


    if (!this.page[data['index']]) {
      this.page[data['index']] = 1;
    }
    if (sendData['page'] == 1) {
      this.page[data['index']]= 1;
    } else {
      this.page[data['index']] = (this.page[data['index']] + 1);
    }
    sendData['page'] = this.page[data['index']];

    return new Promise((resolve, reject) => {
      this.request.post(data['cmd'], data['func'], sendData).then((res) => {
        resolve(res);
      })
    })

  }
}
@Component({
  selector: 'capital-cont',
  templateUrl: 'capital.html'
})
export class Capital extends LoadData implements OnInit{
  public nothing: boolean;
  public isFiniteScroll: boolean = true;
  public index: number = 0;
  public state = {
    '0': {
      data: '',
      nothing: false,
      sendData: {func: 'list', cmd: '3201', accountType: '', pageSize: 10, index: 0}
    },
    '1': {
      data: '',
      nothing: false,
      sendData: {func: 'list', cmd: '3201', accountType: '03', pageSize: 10, index: 1}
    },
    '2': {
      data: '',
      nothing: false,
      sendData: {func: 'list', cmd: '3202', accountType: '03', pageSize: 10, index: 2}
    },
    '3': {
      data: '',
      nothing: false,
      sendData: {func: 'list', cmd: '3203', accountType: '03', pageSize: 10, index: 3}
    }
  }
  constructor(
    request: Request
  ){
    super(request);
  }
  ngOnInit(){
    this.doRefresh();
  }
  doRefresh(refresher?){
    let sendData = Object.assign(this.state[this.index].sendData, {page: 1});
    this.doLoad(sendData).then((res) => {
      let tempData = res['accountLogList'] || res['fillList'] || res['drawList'];

      this.state[this.index].data = tempData;

      if (tempData['length'] == 0) {
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
    let sendData = this.state[this.index].sendData;
    sendData.page = '0';
    this.doLoad(sendData).then((res) => {
      let tempData = res['accountLogList'] || res['fillList'] || res['drawList'];

      this.state[this.index].data = this.state[this.index].data.concat(tempData);

      if (!this.isNoMore(res)) {
        this.isFiniteScroll = false;
      }
      infiniteScroll.complete();
    });
  }
  isNoMore(data){
    return data.itemTotal > data.page * data.pageSize;
  }
  tabSelect(index){

    this.index = index;
    this.isFiniteScroll = true;

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


