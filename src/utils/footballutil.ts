export const footballUtil = {
  '03': [{ active: false, name: '胜胜', value: '33' }, { active: false, name: '胜平', value: '31' }, { active: false, name: '胜负', value: '30' },
    { active: false, name: '平胜', value: '13' }, { active: false, name: '平平', value: '11' }, { active: false, name: '平负', value: '10' },
    { active: false, name: '负胜', value: '03' }, { active: false, name: '负平', value: '01' }, { active: false, name: '负负', value: '00' }],
  '02': [{ active: false, name: '0 球', value: '0' }, { active: false, name: '1 球', value: '1' }, { active: false, name: '2 球', value: '2' },
    { active: false, name: '3 球', value: '3' }, { active: false, name: '4 球', value: '4' }, { active: false, name: '5 球', value: '5' },
    { active: false, name: '6 球', value: '6' },
    { active: false, name: '7+ 球', value: '7' }],
  '04': [
    [
      { active: false, name: '1 - 0', value: '10' }, { active: false, name: '2 - 0', value: '20' }, { active: false, name: '2 - 1', value: '21' },
      { active: false, name: '3 - 0', value: '30' }, { active: false, name: '3 - 1', value: '31' }, { active: false, name: '3 - 2', value: '32' },
      { active: false, name: '4 - 0', value: '40' }, { active: false, name: '4 - 1', value: '41' }, { active: false, name: '4 - 2', value: '42' },
      { active: false, name: '5 - 0', value: '50' }, { active: false, name: '5 - 1', value: '51' }, { active: false, name: '5 - 2', value: '52' },
      { active: false, name: '胜其他', value: '90' }
    ],
    [
      { active: false, name: '0 - 0', value: '00' },
      { active: false, name: '1 - 1', value: '11' },
      { active: false, name: '2 - 2', value: '22' },
      { active: false, name: '3 - 3', value: '33' },
      { active: false, name: '平其他', value: '99' }
    ],
    [
      { active: false, name: '0 - 1', value: '01' }, { active: false, name: '0 - 2', value: '02' }, { active: false, name: '1 - 2', value: '12' },
      { active: false, name: '0 - 3', value: '03' }, { active: false, name: '1 - 3', value: '13' }, { active: false, name: '2 - 3', value: '23' },
      { active: false, name: '0 - 4', value: '04' }, { active: false, name: '1 - 4', value: '14' }, { active: false, name: '2 - 4', value: '24' },
      { active: false, name: '0 - 5', value: '05' }, { active: false, name: '1 - 5', value: '15' }, { active: false, name: '2 - 5', value: '25' },
      { active: false, name: '负其他', value: '09' }
    ],

  ],
  SPFData: [
    { name: '胜', checked: false, sp: '' , term: 3},
    { name: '平', checked: false, sp: '', term: 1 },
    { name: '负', checked: false, sp: '', term: 0 }
  ],
  initSPFData: function () {
    this.SPFData = [{ name: '胜', checked: false, sp: '', term: 3 },
      { name: '平', checked: false, sp: '',term: 1 },
      { name: '负', checked: false, sp: '', term: 0 }];
  },
  pointHandle: function (point) {
    return Number(point).toFixed(2);
  },
  getInitData: function (key) {
    return this[key];
  },

  getNumberList: function (ticketList: any) {
    var result = [], re = /串/g;

    result.push({
      number: getNumber(),
      playCode: ticketList.playCode || '10',
      pollCode: ticketList.pollCode || '02',
      multiple: 1,
      amount: ticketList.amount,
      item: ticketList.item || '1'
    })
    return result;

    function getNumber() {
      var result = '';
      ticketList.matchList.map(function (match: any) {
        result += match.issue + match.sn;
        match.playList.map(function (play) {
          result += ':' + play.playCode;

          if (play.letBall) {
            result += '(' + play.letBall + ')';
          }
          result += '=';
          play.termList.map(function (term, index) {
            result += term.term + '(' + term.sp + ')/';
          })
          result = result.slice(0, -1);
        })
        result += ','

      })

      result = result.slice(0, -1);
      result += '|' + ticketList.passModel.replace(re, '*').replace(/单关/, '1*1');
      return result;
    }
    //20170306001:01(+1)=1(3.60)/0(5.30),20170306002:05=3(5.80)|2*1
  },
  /**
   * @param data {Object}
   * @params key {String}
   */
  serializeFootball: function (data: any, key: string) {

    var starRE = /\*/g,
      DGRE = /1\*1/,
      BFRE = /\:/,
      ZJQRE = /^\d$/,
      tempData = null,
      BonusRE = /\～/g,
      theoryBonus = '',
      tempBonusArray = [],
      letBall = '';

    if (DGRE.test(data.passModel)) {
      data.passModel = '单关';
    } else {
      data.passModel = data.passModel.replace(starRE, '串').replace(',', ' ');
    }
    data.bonusAmount = Number(data.bonusAmount).toFixed(2);

    if (BonusRE.test(data.theoryBonusAmount)) {
      tempBonusArray = data.theoryBonusAmount.split('～');

      theoryBonus = Number(tempBonusArray[0]).toFixed(2).toString() + '~' +  Number(tempBonusArray[1]).toFixed(2).toString();

    } else {
      theoryBonus = Number(data.theoryBonusAmount).toFixed(2);
    }
    data.theoryBonus = theoryBonus;
    tempData = data['matchList'];

    if (tempData) {

      tempData.map(function (match) {
        letBall = '';
        match.playList.map(function (play) {

          if (play.playCode == '01') {
            letBall = play.letBall;
          }
          play.termList.map(function (term) {
            changeData(term);
          })
        })
        match.letBall = letBall;
      })


    }

    tempData = data['ticketList'];
    if (tempData) {
      tempData.map(function (ticket) {
        if (DGRE.test(ticket.passModel)) {
          ticket.passModel = '单关';
        } else {
          ticket.passModel = ticket.passModel.replace(starRE, '串').replace(',', ' ');
        }
        ticket.matchList.map(function (match) {
          match.playList.map(function (play) {
            play.termList.map(function (term) {
              changeData(term);
            })
          })
        })
      })
    }
    function changeData(term){
      term.sp = footballUtil.pointHandle(term.sp);
      // 总进球
      if (ZJQRE.test(term.termName)) {
        term.termName = term.termName + '球';
      }
      // 比分
      if (BFRE.test(term.termName)) {
        term.termName = term.termName.replace(BFRE, ' - ');
      }
    }

  },
  /**
   * 初始数据
   */
  changeData: function (tempData, termName) {

    tempData.map(function (val) {

      if (Array.isArray(val)) {
        val.map(function (obj) {
          if (obj.name == termName) {
            obj.active = true;
          } else {
            obj.active = false;
          }
        })

      } else {


        if (val.name  == termName) {
          val.active = true;

        } else {
          val.active = false;
        }
      }

    })
    return tempData;
  }
};


