import { Component, ViewChild } from '@angular/core';
import { Tabs, NavParams } from 'ionic-angular';
import { ScoreComponent } from '../score/score.component';
import { UserComponent } from '../user/user.component';
import { SoccerComponent } from '../soccer/soccer';
import { HomePage } from '../home/home';
import {HomeService} from '../home/home.service';
import { SoccerService } from '../soccer/soccer.service';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('mainTabs') tabs: Tabs;
  tab1Root = HomePage;
  tab2Root = SoccerComponent;
  tab3Root = ScoreComponent;
  tab4Root = UserComponent;

  constructor(
    private navParams: NavParams,
    private homeService: HomeService,
    private soccerService: SoccerService
  ) {

  }
  ionViewWillEnter() {
    let index = this.navParams.get('index');

    if (index != undefined)
    this.tabs.select(index);
  }
  chat(index){

    //if (index == 0) {
    //  soccerUtil.programmeData['one'] = [];
    //} else if (index == 1) {
    //  soccerUtil.programmeData['multiple'] = [];
    //}
  }
  clearData(){
    //soccerUtil.programmeData['one'] = [];
    //this.homeService.setDefaultProgrammeData();
  }
}
