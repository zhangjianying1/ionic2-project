import { Component, EventEmitter} from '@angular/core';
import { Request } from '../../utils/request';
@Component({

  selector: "score-content",

  templateUrl: 'score.component.html'

})

export class ScoreComponent {

  constructor(
      public request: Request

  ){}


  ionViewDidEnter(){
    this.cron(60000);
  }

  ionViewWillLeave(){
    window.clearTimeout(this.timer1);
    window.clearTimeout(this.timer2);
  }

  weekList = [{name:'周日',active:false,date:''},{name:'周一',active:false,date:''},{name:'周二',active:false,date:''},{name:'周三',active:false,date:''},{name:'周四',active:false,date:''},{name:'周五',active:false,date:''},{name:'周六',active:false,date:''}];
  matchList:string[] = [];
  endDate:any = '';
  active_date:any = '';
  today_date:any = '';
  public getWeek(){
    let today = new Date();
    let week = today.getDay();
    this.weekList[week].name = "今";
    this.weekList[week].active = true;
    let [e_year,e_month,e_day] = this.endDate.split('-');
    let end_date = new Date();
    end_date.setFullYear(parseInt(e_year),parseInt(e_month) -1 ,parseInt(e_day));
    let end_week = end_date.getDay();
    let new_week_list:any[] = [];
    var i:number = 0;
    while(i < 7){
      let key:any = end_week-i>=0 ? end_week-i : end_week - i + 7 ;
      this.weekList[key].date = this.formatDate(end_date.getTime() - ( 1000 * 3600 * 24 * i )) ;
      new_week_list.push(this.weekList[key]);
      i += 1;
    }
    this.weekList = new_week_list.reverse();
    return this.weekList;
  }

  public  formatDate( time: any ){
  // 格式化日期，获取今天的日期
    let Dates = new Date( time );
    let year: number = Dates.getFullYear();
    let month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
    let day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    return year + month + day;
}
  ngOnInit(){
    this.today_date  = this.formatDate(new Date().getTime());
    this.active_date = this.formatDate(new Date().getTime());
    this.getMatchDate();
    this.doRefresh();

  }
  weekShow:any = '';

  public doRefresh(refresher?: any){
    this.getMatchList(this.active_date);
    refresher && refresher.complete();
  }
  public serializeMatchData(data):any {
    var arr_1:string[] = [];
    var arr_2:string[] = [];
    var arr_3:string[] = [];
    data.map(function(val,index){
      if(val.matchState == '0'){
        val.stateName="未开赛";
        arr_2.push(val);
      }else if(val.matchState == '23'){
        val.stateName="完场";
        arr_3.push(val);
      }else if(val.matchMinutes >0 ){
        val.stateName="进行中";
        arr_1.push(val);
      }else{
         //del.push(index);
      }
    });
    return  arr_1.concat(arr_2,arr_3);
  }
  public  change(date,j){
    if(date != this.active_date){
      this.flag = true;
    }
    this.weekList.map(function(val,index){
      if(index == j){
        val.active = true;
      }else{
        val.active = false;
      }
    });
    this.active_date = date;
    this.getMatchList(date);
  }
  flag:any = true;
  public getMatchDate():any{
      this.request.post('5000','liveScoreDate',{lotteryId:200}).then((res)=>{
        this.endDate = res['end_date'].toString();
        this.weekShow = this.getWeek();
      });

  }

  public getMatchList(date:any){
    if(this.flag) {
      this.flag = false;
      this.request.post('5000', 'liveScore', {lotteryId: 200, issue: date}).then((res)=> {
        if(this.active_date == date){  //连续切换标签时 只显示最终的
          this.matchList = this.serializeMatchData(res);
        }
        this.flag = true;
      },(err)=>{
        this.flag = true;
      });
    }
  }
  timer1:any = '';
  timer2:any = '';
  public cron(interval:any){

    this.timer1 = setTimeout(()=>{
      if(this.active_date == this.today_date){
        this.flag = true;
        this.doRefresh();
      }
      this.timer2 = setTimeout(this.cron(interval),interval)

    },interval)

}













}
