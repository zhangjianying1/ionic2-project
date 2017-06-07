import { Injectable, Pipe} from '@angular/core';

@Pipe({
  name: 'transData'
})
@Injectable()
export class TransferData{
  transform(value, args) {

    if (!value) return '';

    let temp = value.split(' ');
    let date = temp[0].split('-');
    let houre =  temp[1].split(':');
    let oDate = new Date(date[0], date[1]-1, date[2], houre[0], houre[1], houre[2]),
      day: string;

    switch (oDate.getDay()) {
      case 1:
        day = '周一';
        break;
      case 2:
        day = '周二';
        break;
      case 3:
        day = '周三';
        break;
      case 4:
        day = '周四';
        break;
      case 5:
        day = '周五';
        break;
      case 6:
        day = '周六';
        break;
      case 0:
        day = '周日';
        break;
      //default;
    }
    let hours =  repair(oDate.getHours()) +':'+ repair(oDate.getMinutes());

    return day + ' ' + hours;

    function repair(str: any){
      str = Number(str);


      if (str < 10) {
        return '0' + str;
      }
      return str;
    }
  }
}
