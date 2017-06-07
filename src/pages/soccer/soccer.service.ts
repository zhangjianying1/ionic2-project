import { Injectable } from '@angular/core';
export type Programme = {
  [key: string]: any
};

@Injectable()
export class SoccerService{

  public _soccerData = [];
  public proData = {
    multiple: {},
    cross: {},
    bonus: {},
    state: {}
  };
  public _programmeData : Programme = Object.assign({}, this.proData);

  public _crossData = {data: []};

  public setCrossData(value: any){
    this._crossData = value;
  }
  public setSoccerData(value: any){
    this._soccerData = value;
  }

  public getSoccerData(index?: number){

    if (index) {
      return this._soccerData[index];
    }
    return this._soccerData;

  }

  public setProgrammeData(value: Programme){
    this._programmeData = value;
  }
  public setDefaultProgrammeData(){
    this._programmeData = Object.assign({}, this.proData);
  }
  public setkey(key: string, value: any){
    this._programmeData[key] = value;
  }
}
