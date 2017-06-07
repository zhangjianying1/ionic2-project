import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'recharge-cont',
  templateUrl: 'profile.html'
})
export class Profile implements OnInit{
  public oIfr: any;
  public title: string;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ){}
  ngOnInit(){
    let payUrl = this.navParams.get('payUrl');
    this.oIfr = document.createElement('iframe');
    this.oIfr['width'] = '100%';
    this.oIfr['height'] = (document.body.clientHeight - 44) + 'px';
    this.oIfr['style'].position = 'fixed';
    this.oIfr['style'].top = '44px';
    this.oIfr['style'].left = '0';
    document.body.appendChild(this.oIfr);
    this.oIfr.src = payUrl;
    this.title = this.navParams.get('title');

  }
  closeHandle(){
    document.body.removeChild(this.oIfr);
    this.navCtrl.pop();

  }
}
