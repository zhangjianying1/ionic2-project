import { Component, OnInit, Input} from '@angular/core';
import { ViewController } from 'ionic-angular';
@Component({
  selector: 'picker',
  template: ` <div class="calender active" (click)="closeHandle()">
                <div class="calender-box slide-in-up" >
                    <div class="calender-header">
                        <span class="middle-btn btn-default" (click)="closeHandle()">取消</span>
                        <h2></h2>
                        <span (click)="callback(this.value)" class="middle-btn btn-primary">确定</span>
                    </div>
                    <div class="calender-body">
                        <div class="mask">
                            <div class="calender-date">
                                <div *ngFor="let item of data; let index = index " class="clumn" [ngClass]="index ? 't' + index : 't' + index ">
                                    <ul>
                                      <li *ngFor="let val of item">{{val.bankName}}</li>
                                    </ul>
                                    <div class="bor-box"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>`,
  inputs: ['callback', 'closeHandle']
})


  /**
   * select 选择
   */
export class Picker implements OnInit{

  constructor(
    private viewCtrl: ViewController
  ){
    viewCtrl.didEnter.subscribe(this.initDom.bind(this));
  }
  @Input()
  public value;
  @Input()
  public data;

  ngOnInit(){

    setTimeout(this.initDom.bind(this), 2000);
  }
  initDom(){
    this.data.map((val, index) => {

      let oYear = document.querySelector('.t' + index);

      // 注册函数
      this.touchHandler(oYear, this.getIndex(val), (current) => {
        this.value = val.slice(Math.abs(current-2), Math.abs(current-2) + 1)[0].bankName;
      })

    })


    // 阻止页面滚动
    document.querySelector('.calender').addEventListener('touchmove', function(e){
      e.preventDefault();
    } , false)
  }
  getIndex(val): number{
    let index = 2;

    // 匹配后返回所在数组的索引
    for (let i = 0; i < val.length; i ++) {

      if (val[i].bankName == this.value) {
        index = i;
        break;
      }
    }

    return index;
  }

  touchHandler(obj , current, func){
    let boundaryT = 0,      // 触摸的起点
      moveDistance,       // move的距离
      temp = 0,           // move的缓存
      speed = 0,          // 速度
      timer = null,
      parentDiv = obj,
      s = 1,
      transDom = obj.querySelector('ul'),
      oLiH = obj.querySelector('li').offsetHeight,
      index = current,
      moveT;

    if (current == 0) {
      index = 2;
    } else if (current > 1) {
      index = -current + 2;
    }
    moveT = index * oLiH;

    console.log(moveT)
    // 默认定位
    if (index != 0) {
      transDom.style.transform = 'translate3d(0, '+ moveT + 'px, 0)';
      transDom.style.webkitTransform = 'translate3d(0, '+ moveT + 'px, 0)';
    }
    /**
     * 触摸开始
     * @param e {Object}
     */
    function tStart(e){
      let event = e.touches[0];
      boundaryT = event.pageY;
      clearInterval(timer);
      transDom.style.transform = 'translateY(' + moveT  + 'px)';
      transDom.style.webkitTransform = 'translateY(' + moveT  + 'px)';
    }

    /**
     * 滑动
     * @param e {Object}
     */
    function tMove(e){

      let event = e.touches[0];

      moveDistance = (event.pageY - boundaryT);

      speed = event.pageY - temp;
      temp = event.pageY;

      moveDistance = goDefault(moveDistance , s);

      transDom.style.transform = 'translate3d(0, '+ (moveT + moveDistance)  + 'px, 0)';
      transDom.style.webkitTransform = 'translate3d(0, '+ (moveT + moveDistance)  + 'px, 0)';
      transDom.style.transitionDuration = '0';
      transDom.style.webkitTransitionDuration = '0';

      e.stopPropagation();
      e.preventDefault();
    }

    /**
     * 触摸结束
     * @param e
     */
    function tEnd(e){
      moveT += moveDistance;
      timer = setInterval(function(){
        speed = speed * .95;
        moveT += speed;

        if (Math.abs(speed) <= 3) {
          clearInterval(timer);
          speed = 0;

          transDom.style.transitionDuration = '100ms';
          transDom.style.webkitTransitionDuration = '100ms';
          if (moveT > oLiH*2) {
            moveT = oLiH*2;
          }
          if (moveT < -transDom.offsetHeight + oLiH*3){
            moveT = -transDom.offsetHeight + oLiH*3;
          }

          // 重置index
          index = setIndex(moveT , oLiH);
          moveT = oLiH * index

          func(index);

        } else {
          moveT = goDefault(moveT , s);

        }


        transDom.style.transform = 'translate3d(0, '+ moveT + 'px, 0)';
        transDom.style.webkitTransform = 'translate3d(0, '+ moveT + 'px, 0)';

      }, 30)
    }

    obj.addEventListener('touchstart' , tStart , false);
    obj.addEventListener('touchmove' , tMove, false);
    obj.addEventListener('touchend' , tEnd, false);


    /**
     * 减速
     * @param moveT {Number}
     * @param s {Number}
     * @returns moveT {Number}
     */
    function goDefault(moveT , s){

      if (moveT > 0 ) {
        s = ( 1 + moveT / (parentDiv.offsetHeight / 2));
        moveT = moveT /s
      } else if (moveT < -transDom.offsetHeight + parentDiv.offsetHeight){

        let iMove = moveT + (transDom.offsetHeight - parentDiv.offsetHeight);
        s = ( 1 + Math.abs(iMove) / (parentDiv.offsetHeight / 2));

        moveT = (-transDom.offsetHeight + parentDiv.offsetHeight) + iMove / s;
      }
      return moveT;
    }

    /**
     * 找到终点的索引
     * @param moveT
     * @param oLiH
     * @returns {number}
     */
    function setIndex(moveT, oLiH){

      if (moveT == 0) return 0;

      // 偏移的距离
      let iOffset = Math.abs(moveT) % oLiH;

      //if (moveT > 0 && moveT < oLiH) {
      //  iOffset = oLiH - moveT;
      //} else {
      //  iOffset = Math.abs(moveT) % oLiH;
      //}
      console.log(iOffset + ': ' + (moveT / oLiH))

      if (iOffset < (oLiH/2)) {

        if (moveT > 0) {
          return Math.floor( moveT / oLiH)
        } else {
          return Math.ceil( moveT / oLiH)
        }

      } else {
        if (moveT > 0) {
          return Math.ceil( moveT / oLiH)
        } else {
          return Math.floor( moveT / oLiH)
        }
      }
    }

  }
  // 关闭日历
  close(){
    this.closeHandle();
  }

  closeHandle(){

  }

}
