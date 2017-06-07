import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Request } from '../../../utils/request'

@Component({
  selector: 'programme-detail',
  templateUrl: 'programme.detail.html'
})
export class ProgrammeDetail implements OnInit{
  public programmeData: any = {};
  public nothing: boolean;
  constructor(
    private request: Request,
    private navParams: NavParams
  ){}

  ngOnInit(){
    let programsOrderId = this.navParams.get('programsOrderId');

    this.request.post('3306', 'userPrograms', {programsOrderId: programsOrderId}).then((res) => {

      if (!res['code']) {

        this.programmeData = this.serializeData(res);
      }
    })
  }
  serializeData(data: any){

    data['match'].passModel = data.match.passModel == '1*1' ? '单关' : data.match.passModel.replace('*', '串');
    data['match'].matchList.map(function(o, index){

      return o['playList'].map((play)=>{
        return play.termList.map((item) => {
          return changeData(item, play.playCode);
        })
      })

    })
    return data;

    function changeData(item, playCode){
      let re = /([0-9])/g;


      // 总进球
      if ( playCode == '02') {

        if (item.term == '7') {
          item.name = '7+ 球';

        } else {
          item.name = item.term + ' 球';

        }
      }
      // 比分
      if (playCode == '04') {
        if (item.term == '99') {
          item.name = '平其他'
        } else if (item.term == '09') {
          item.name = '负其他'
        } else if (item.term == '90') {
          item.name = '胜其他'
        } else {
          item.name = item.termName.replace(':', ' - ');

        }
      }
      // 半全场
      if (playCode == '03') {

        item.name = item.term.replace(re, function($1, $2){
          if($2==0) $2='负';
          if($2==1) $2='平';
          if($2==3) $2='胜';
          return $2
        })
      }

      if (playCode == '05' || playCode == '01') {

        if (item.term == 0) {
          item['name'] = '客胜';
        } else  if (item.term  == 1) {
          item['name'] = '平局';
        } else  if (item.term  == 3) {
          item['name'] = '主胜';
        }
      }
      console.log(item);
      return item;
    }
  }

}
