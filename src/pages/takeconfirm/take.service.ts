import { Injectable } from '@angular/core';
export type Programme = {
  [key: string]: any
};

@Injectable()
export class TakeService{
  public defaultData = {
    multiple: {},
    cross: {},
    bonus: {}
  };

  public _takeData = [];
  public _soccerData = [];
  public _programmeData : Programme = Object.assign({}, this.defaultData);

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
    this._programmeData = Object.assign({}, this.defaultData);
  }
  public setkey(key: string, value: any){
    this._programmeData[key] = value;
  }

  public setTakeData(value){
    this._takeData = value;
  }
  public getTakeData(){
    return this._takeData;
  }
}
