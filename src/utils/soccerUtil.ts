import {publicUtil}  from './publicutil';
import {footballUtil} from './footballutil';
export const soccerUtil = {
  crossData: [
    [{name: '单关', active: false}, {name: '2 串 1', active: false},{name: '3 串 1', active: false},{name: '4 串 1', active: false}
      , {name: '5 串 1', active: false},{name: '6 串 1', active: false},{name: '7 串 1', active: false},{name: '8 串 1', active: false}],
    [{name: '3 串 3', active: false},{name: '3 串 4', active: false}],
    [{name: '4 串 4', active: false}, {name: '4 串 5', active: false},{name: '4 串 6', active: false},{name: '4 串 11', active: false}],
    [{name: '5 串 5', active: false}, {name: '5 串 6', active: false},{name: '5 串 10', active: false},{name: '5 串 16', active: false},                {name: '5 串 20', active: false},{name: '5 串 26', active: false}],
    [{name: '6 串 6', active: false}, {name: '6 串 7', active: false},{name: '6 串 15', active: false},{name: '6 串 20', active: false},                {name: '6 串 22', active: false},{name: '6 串 35', active: false}, {name: '6 串 42', active: false},{name: '6 串 50', active: false},             {name: '6 串 57', active: false}],
    [{name: '7 串 7', active: false}, {name: '7 串 8', active: false},{name: '7 串 21', active: false},{name: '7 串 35', active: false},                 {name: '7 串 120', active: false}],
    [{name: '8 串 8', active: false}, {name: '8 串 9', active: false},{name: '8 串 28', active: false},{name: '8 串 56', active: false},                {name: '8 串 70', active: false},{name: '8 串 247', active: false}],
  ],
  fiveTeam : [],
  /**
   * 五大联赛是否全选中
   */
  isfiveTeamAll: function(arr?){


    if (soccerUtil.filterData.length == 0) return false;

    return soccerUtil.filterData.sort().toString() == soccerUtil.fiveTeam.sort().toString();
  },
  /**
   * 联赛筛选
   * @param arr{Array} 联赛数据
   */
  filterPlay: function(arr: any){
    let result = [];

    try {

      arr.map(function(shut){

        shut.match.map(function(val, index){

          // 符合
          if (publicUtil.isexits(result, val.matchName) == -1) {
            result.push(val.matchName);
          }

        })
      });
    } catch (e){

    } finally{
      result = result.map(function(val){

        if (publicUtil.isexits(['意甲', '英超', '西甲', '德甲', '法甲'], val) != -1) {
          soccerUtil.fiveTeam.push(val);
        }
        soccerUtil.filterData.push(val);
        return {name: val, active: true}
      })

      return result;
    }
  },
  /**
   * 筛选比赛
   * @param data {Array}
   * @param filer {Array} 对阵
   * @param filter2 {String} 玩法
   */
  filterShutData: function(data, filter, filter2){

    let tempData = data, count = 0, emptyIndex = 0, bBtn = false;

    tempData.map(function(shut, index){

      count = 0;

      shut.match.map(function(val, index){

        if (filter2 == '单关'){
          val.spfOne = 1;
          // 符合
          if (val.spfSingle == 1  && publicUtil.isexits(filter, val.matchName) != -1) {
            // 特殊标记 用于前端页面展示
            val.spfSingle  = -1;

            count ++

          } else if (val.rqspfSingle == 1 && publicUtil.isexits(filter, val.matchName) != -1) {
            // 特殊标记 用于前端页面展示
            val.rqspfSingle  = -1;
            count ++
          } else {
            val.isHide = true;
          }
        } else {
          // 符合
          if (publicUtil.isexits(filter, val.matchName) != -1) {
            count ++

          } else {
            val.isHide = true;
          }
        }

      })


      shut.matchTotal = count;

      if (shut.matchTotal == 0) {
        emptyIndex ++;
      } else if (!bBtn){
        shut.active = true;
        bBtn = true;
      }

    });



    // 没有找到查询的结果
    if (tempData.length == emptyIndex) return [];

    return tempData;

  },
  /**
   * 特殊的数组
   */
  listMap: function(list, bool, name?){

    list.map(function(val){


      if (name) {

        if (name == val.name) {
          val.active = true;
        }

      } else {
        val.active = bool;
      }

    })
    return list;
  },
  /**
   * 反选
   */
  reverseMap: function(list){
    list.map(function(val){

      if (val.active) {

        val.active = false;


      } else {
        val.active = true;
      }

    })
    return list;
  },
  /**
   * 特殊的顾虑方式
   * @param arr {Array}
   * @returns resuylt {Array} 找到的数据集合
   */
  foundName: function(arr){
    let result = [];


    found(arr);
    function found(arr){
      arr.map(function(val){

        if (Array.isArray(val)) {
          found(val);
        } else {
          if (val.active) {
            result.push(val.name);
          }
        }
      })
    }

    return result;
  },
  // 场次过滤
  filterData: [],
  /**
   * 设置过滤的标签
   * @param arg {Array or String} 是数组时直接覆盖；字符串时添加
   */
  setFilterData: function(arg) {
    let result;


    if (Array.isArray(arg)) {
      this.filterData = arg;
    } else {
      result = publicUtil.isexits(this.filterData, arg);

      if (result > -1) {
        this.filterData.splice(result, 1);
      } else {
        this.filterData.push(arg)
      }
    }

  },
  /**
   * 序列化数据
   */
  serializeSoccerData: function(data){
    let tempData = {};
    let timeRE = /(\d{4})(\d{2})/, tempArray = [];

    data.map(function(val, index){

      let total = 0,
         isPlusSp = false;
      val.active = true;


      val.date = val.date.replace(timeRE, '$1-$2-');

      val.match.map(function(m) {
        m.key = m.week + m.sn;
        m.endTime = m.endTime.slice(11, 16);
        tempArray = [];

        // 加奖
        if (Array.isArray(m['spfPlus']) && m['spfPlus'].length > 1) {
          m.spfShow = true;
          m.hasSelected = false;
          isPlusSp = true;
          total++;
        }
        // 加奖
        if (Array.isArray(m['rqspfPlus']) && m['rqspfPlus'].length > 1) {
          m.rqspfShow = true;
          m.hasSelected = false;
          isPlusSp = true;
          total++;
        }
        // 胜平负
        m.spfSp = dataHandle(m.spfSp, m['spfPlusPercent']);


        // 让球胜平负
        m.rqspfSp = dataHandle(m.rqspfSp, m['rqspfPlusPercent']);
      });

      if (isPlusSp) {
        val.matchTotal =  total;
      }

      // 是否加奖
      val.isPlusSp = isPlusSp;

    })


    return data;

    function dataHandle(data, arr: any){

      return data.map(function(o, index){
        tempData = Object.assign({}, footballUtil['SPFData'][index]);
        tempData['sp'] = o;
        tempData['active'] = false;

        if (index == 0) {
          tempData['name'] = '主胜';
        } else  if (index == 1) {
          tempData['name'] = '平局';
        } else  if (index == 2) {
          tempData['name'] = '客胜';
        }


        if (arr && arr[index]) {
          let transVal: any = parseFloat(arr[index]) * 100;
          tempData['plus'] = parseInt( transVal ) + '%' || '';
          tempData['plusResult'] = (Number(o) + (o * transVal/100)).toFixed(2);
        }

        return tempData;
      })
    }
  },
  /**
   * 方案数据
   */
  programmeData: {
    one: [],
    multiple: []
  },
  /**
   * 添加方案数据
   * @param data {Object} 插入的数据
   * @param len {Number} 最大长度
   * @returns result {Number} 插入返回插入的位置 否则返回-1
   */
  setProgrammeData: function(key: string, data, len?){
    let index = -1,isPush, issueIndex, termLen = 0, tempData = {},
    keyIndex = isexitsKey(data);

    // key不同
    if (keyIndex == -1) {

      if (len == soccerUtil.programmeData[key].length) return -1;
      isPush = pushKeyData(data);
      if (isPush == -1) return isPush;

    } else {
      issueIndex = isexitsIssue(soccerUtil.programmeData[key][keyIndex].resultList, data);

      // 没有同族赛果
      if (issueIndex == -1) {

        // 插入赛果
        pushIssueData(data, keyIndex);

      } else {

        tempData = soccerUtil.programmeData[key][keyIndex];

        tempData['resultList'][issueIndex]['termList'].map(function(term, i){

          termLen ++;
          // term 相同 并且 玩法一样
          if ((term.term == data.term)) {
            index = i;
            termLen --;
          }

        })

        // 里面已经存在（就删除）
        if (index > -1) {
          tempData['resultList'][issueIndex]['termList'].splice(index, 1);

        } else {

          // 添加
          tempData['resultList'][issueIndex]['termList'].push(data);

        }

        if (!termLen) {
          tempData['resultList'].splice(issueIndex, 1);

          if (tempData['resultList'].length == 0) {
            soccerUtil.programmeData[key].splice(keyIndex, 1);
          };
        }

      }

    }
    return soccerUtil.programmeData[key];
    /**
     * 插入
     * @param data {Object}
     * @returns result {Number} 0 =》 插入成功 -1 =》 失败
     */
    function pushKeyData(data){
      let result = 0,
        tempData = {
          key: data.issue + data.sn,
          issue: data.issue,
          sn: data.sn,
          letBall: data.letBall,
          week: data.week,
          mainTeam: data.mainTeam,
          guestTeam: data.guestTeam,
          resultList: [{
            single: data.single,
            issue: data.issue,
            sn: data.sn,
            sign: data.sign,
            playId: data.playId,
            termList: [data]
          }]  // 多种赛果 [[], [], [], [], []] // 五种赛果
        };

      // 数组最大长度8
      if (soccerUtil.programmeData[key].length == 8) {
        result = -1;
      } else {
        soccerUtil.programmeData[key].push(tempData)
      }
      return result;
    }

    /**
     * 插入
     * @param data {Object}
     * @param keyIndex {Number} 数组的下标
     * @returns result {Number} 0 =》 插入成功 -1 =》 失败
     */
    function pushIssueData(data, keyIndex){
      let result = 0,
        tempData = {
          single: data.single,
          issue: data.issue,
          sn: data.sn,
          sign: data.sign,
          playId: data.playId,
          termList: [data]
        };
      if (soccerUtil.programmeData[key].length == 8) {
        result = -1;
      } else {
        soccerUtil.programmeData[key][keyIndex].resultList.push(tempData)
      }

      return result;
    }

    /**
     * 判断数组 key 不重复
     */
    function isexitsIssue(sourceData, data){
      let result = -1;

      sourceData.map(function(source, index){

        // 同族赛果
        if (source.sign == data.sign) {
          result = index;
        }
      })
      return result;
    }

    /**
     * 判断数组 key 不重复
     */
    function isexitsKey(data){
      let result = -1;

      soccerUtil.programmeData[key].map(function(programme, index){

        // 同期次下
        if (programme.key == (data.issue + data.sn)) {
          result = index;
        }
      })
      return result;
    }

  },
  /**
   * 是否单关
   */
  isPass: function(data: any){
    let result = true;

    if (data.length == 0) return false;

    data.map(function(programme){
      programme.resultList.map(function(r){

        if (!r.single) {
          result = false;
        }
      })

    })
    return result;
  },
  /**
   * 排序顺便记录下算奖用的
   * @param data
   * @returns {any}
   */
  sortProgrammeData: function(data: any){

    data.map(function(programme){
      programme.resultList.map(function(result){

        //let index;
        //// 设置理论奖金用
        //result['termList'].map((term, i) => {
        //  let min = 0;
        //  term.act = false;
        //  if ((term.sign == 'spfSp' || term.sign == 'rqspfSp') && crossData[0] == '单关') {
        //
        //    if (term.sp > min) {
        //      min = term.sp;
        //      index = i;
        //    }
        //  } else {
        //    term.act = true;
        //  }
        //})
        //
        //if (index !== undefined) result['termList'][index].act = true;

        result['termList'] = result.termList.sort(function(a, b){
          return Number(a.index) > Number(b.index);
        });
      })
    })

    return data;
  },
  /**
   * 计算助手
   *
   */
  calcuatorItems: function(arr){
    let a, b, c, d, e, f, g, h, result = [];

    switch (arr.length) {
      case 1:
        a = arr[0];
        break;
      case 2:
        a = arr[0];
        b = arr[1];
        break;
      case 3:
        a = arr[0];
        b = arr[1];
        c = arr[2];
        break;
      case 4:
        a = arr[0];
        b = arr[1];
        c = arr[2];
        d = arr[3];
        break;
      case 5:
        a = arr[0];
        b = arr[1];
        c = arr[2];
        d = arr[3];
        e = arr[4];
        break;
      case 6:
        a = arr[0];
        b = arr[1];
        c = arr[2];
        d = arr[3];
        e = arr[4];
        f = arr[5];
        break;
      case 7:
        a = arr[0];
        b = arr[1];
        c = arr[2];
        d = arr[3];
        e = arr[4];
        f = arr[5];
        g = arr[6];
        break;
      case 8:
        a = arr[0];
        b = arr[1];
        c = arr[2];
        d = arr[3];
        e = arr[4];
        f = arr[5];
        g = arr[6];
        h = arr[7];
        break;
      //default:

    }
    a.map(function(a1, sign){
      if (b) {
        b.map(function(b1){

          if (c) {
            c.map(function(c1){

              if (d) {
                d.map(function(d1){

                  if (e) {
                    e.map(function(e1){

                      if (f) {
                        f.map(function(f1){

                          if (g) {
                            g.map(function(g1){

                              if (h) {
                                h.map(function(h1){
                                  result.push([a1, b1, c1, d1, e1, f1, g1, h1]);
                                })
                              } else {
                                result.push([a1, b1, c1, d1, e1, f1, g1]);
                              }
                            })
                          } else {
                            result.push([a1, b1, c1, d1, e1, f1]);
                          }
                        })
                      } else {
                        result.push([a1, b1, c1, d1, e1]);
                      }
                    })
                  } else {
                    result.push([a1, b1, c1, d1]);
                  }
                })
              } else {
                result.push([a1, b1, c1]);
              }
            })
          } else {

            result.push([a1, b1]);
          }
        })
      } else {
        result.push([a1])
      }

    })

    return result;
  },
  getGroup: function(group, mode){

    let result;

    if ( mode == '单关' || mode == '1*1'){

      result = getOnePassItem(group);


    }
    else if (mode == '3*1') {
      result = conbimationResult(group, 3);
    } else if (mode == '3*3' || mode == '2*1' || mode == '4*6' || mode == '5*10' || mode == '6*15'){


      result = conbimationResult(group, 2);

    }
    else if (mode == '4*1' || mode == '5*5' || mode == '7*35' || mode == '8*70') {
      result = conbimationResult(group, 4);

    } else if (mode == '4*4' || mode == '6*20') {
      result = conbimationResult(group, 3);

    } else if (mode == '5*1' || mode == '6*6'  || mode == '7*21' || mode == '8*56') {
      result = conbimationResult(group, 5);
    } else if (mode == '6*1' || mode == '7*7' || mode == '8*28') {
      result = conbimationResult(group, 6);
    } else if (mode == '4*5') {
      result = conbimationResult(group, 3).concat(conbimationResult(group, 4));
    } else if (mode == '3*4' || mode == '5*20' || mode == '6*35') {
      result = conbimationResult(group, 2).concat(conbimationResult(group, 3));
    } else if (mode == '5*6') {
      result = conbimationResult(group, 4).concat(conbimationResult(group, 5));
    } else if (mode == '5*16') {
      result = conbimationResult(group, 3).concat(conbimationResult(group, 4)).concat(conbimationResult(group, 5));
    } else if (mode == '5*26') {
      result = conbimationResult(group, 2).concat(conbimationResult(group, 3)).concat(conbimationResult(group, 4)).concat(conbimationResult(group, 5));
    } else if (mode == '6*7') {
      result = conbimationResult(group, 5).concat(conbimationResult(group, 6));
    } else if (mode == '6*22') {
      result = conbimationResult(group, 4).concat(conbimationResult(group, 5)).concat(conbimationResult(group, 6));
    } else if (mode == '6*42'){
      result = conbimationResult(group, 3).concat(conbimationResult(group, 4)).concat(conbimationResult(group, 5)).concat(conbimationResult(group, 6));
    } else if (mode == '6*50' || mode == '4*11') {
      result = conbimationResult(group, 2).concat(conbimationResult(group, 3)).concat(conbimationResult(group, 4));

    } else if (mode == '6*57') {
      result = conbimationResult(group, 2).concat(conbimationResult(group, 3)).concat(conbimationResult(group, 4)).concat(conbimationResult(group, 5)).concat(conbimationResult(group, 6));
    } else if (mode == '7*8') {
      result = conbimationResult(group, 6).concat(conbimationResult(group, 7));

    } else if (mode == '7*120') {
      result = conbimationResult(group, 2).concat(conbimationResult(group, 3)).concat(conbimationResult(group, 4)).concat(conbimationResult(group, 5)).concat(conbimationResult(group, 6)).concat(conbimationResult(group, 7));
    } else if (mode == '8*1') {
      result = conbimationResult(group, 8);
    } else if (mode == '8*8' || mode == '7*1') {

      result = conbimationResult(group, 7);
    } else if (mode == '8*9') {
      result = conbimationResult(group, 7).concat(conbimationResult(group, 8));
    } else if (mode == '8*247') {
      result = conbimationResult(group, 2).concat(conbimationResult(group, 3)).concat(conbimationResult(group, 4)).concat(conbimationResult(group, 5)).concat(conbimationResult(group, 6)).concat(conbimationResult(group, 7)).concat(conbimationResult(group, 8));
    } else {

      result = [];
    }

    return result;

    function conbimationResult(group, count){
      let result = [];

      let tempArray = publicUtil.combination(group, count);


      Array.isArray(tempArray) && tempArray.map(function(val){

        result = result.concat(soccerUtil.calcuatorItems(val));
      })

      return result;
    }

    /**
     * 计算单关注数
     */
    function getOnePassItem(group){

      let result = [];

      group.map(function(val){
        val.map(function(o){
          result.push([o])
        })
      })

      return result;
    }
  },
  /**
   *  计算注数和理论奖金
   *  @param crossData {Array} 串关标签数组 （没有则默认是几串1）
   *  @params multiple {Nmber} 倍数
   *  @returns result {Array}
   */
  getPrice: function(data, crossData, multiple){

    let result = {}, itemArray = [],
      tempData = soccerUtil.changeArrayMaxProperty(soccerUtil.sortProgrammeData(data), crossData);

    // 遍历出串关的标签进行计算 并且 取 crossData 里面的标签计算出注数最小和最大
    crossData.map((item) => {
      let re =  /(串|\s串\s)/g;

      if (item == '单关') {
        item = '1*1';
      } else {
        item = item.replace(re, '*');
      }
      itemArray = itemArray.concat(splitArray(tempData, item));
    });

    multiple = !multiple ? 1 : multiple;

    result['amount'] = getItem(itemArray) * 2 * multiple;
    result['bonus'] = soccerUtil.calcuatorBonus(itemArray, multiple) ;
    return result;

    /**
     * 遍历找到相关数据
     */
    function serializeArray(arr){
      let result = [];
      arr.map(function(val){
        result.push(val.termList);
      })
      return result;
    }

    /**
     * 拆数组
     */
    function splitArray(sourcesData, cross){
      let result = [], tempData = [];

      sourcesData.map(function(programme){
        tempData.push(programme.resultList);
      });


      if (cross !== '1*1') {

        if (tempData.length > cross.substring(0, 1)) {
          tempData = soccerUtil.getGroup(tempData, cross);
        } else {
          tempData = soccerUtil.calcuatorItems(tempData);
        }
      }


      tempData.map(function(val){

        result.push(soccerUtil.getGroup(serializeArray(val), cross));
      })


      return result;
    }
    /**
     * 计算注数
     */
    function getItem(itemArray){

      let result = 0;
      itemArray.map(function(item){

        result += item.length;
      })
      return result;
    }
  },
  /**
   * 计算奖金
   * @param arr {Array} 方案数组
   * @param multiple {Number} 倍数
   */

  calcuatorBonus: function(itemArray, multiple){

    let result = 0;

    itemArray.map(function(item){

      item.map(function(val){

        if (hasActive(val)) {
          result += countBouns(val);
        }
      })
    })

    return Number(result * multiple).toFixed(2);

    /**
     * 单注奖金计算
     */
    function countBouns(arr){
      let result = 2;

      arr.map(function(o){

        if (o.plusResult) {
          result *= o.plusResult;
        } else {
          result *= o.sp;
        }


      })

      return result;
    }

    /**
     * 是否数组对象的其中一个成员的active属性为false时不用计算奖金
     * @param arr {Array}
     * @returns {Boolean}
     */
    function hasActive(arr){
      let result = 1;

      arr.map(function(val){

        //if (val.sign == "spfSp" || val.sign == "rqspfSp") {
          if (!val.act) {
            result = 0;
          }
        //}

      })
      return result;
    }

  },
  /**
   * 改变数组中的数据
   */
  changeArrayMaxProperty: function(data, crossData?){


    let tempData = Object.assign([], data);

    tempData.map(function(programme){

      hasProperty(programme.resultList);

      programme.resultList.map(function(result){

        let index = 0, min = 0;
        // 设置理论奖金用
        result['termList'].map((term, i) => {

          term.act = false;

          //if ((term.sign == 'spfSp' || term.sign == 'rqspfSp')) {

            if (term.sp > min) {
              min = term.sp;
              index = i;
            }
          //}
        })
        min = 0;
        if (index !== undefined) result['termList'][index].act = true;
      })
    })

    return tempData;



    /**
     * 找到要设置的数组成员
     */
    function hasProperty(data){
      let tempArray = [];

      data.map(function(val){

        if (val.sign == 'spfSp' || val.sign == 'rqspfSp'){
          tempArray.push(val);
        }
      })
      // soccerUtil.changeMaxData(tempArray);
      let arrIndex = [[],[]];

      // 胜平负
      if (tempArray[0] && tempArray[0].letBall == 0) {
        setSPF(tempArray[0], tempArray[1], arrIndex[0]);

        if (tempArray[1]) {
          setRQ(tempArray[1], tempArray[0], arrIndex[1])
        }

      } else if (tempArray[0]){
        setRQ(tempArray[0], tempArray[1],  arrIndex[1])

        if (tempArray[1]) {
          setSPF(tempArray[1], tempArray[0], arrIndex[0])
        }


      }

      soccerUtil.changeMaxData(arrIndex, tempArray);
    }

    /**
     * 找到数组中最大的sp值
     * @param data {Array}
     */
    function getSp(data, term){
      let result = 0,
        num = 0,
        termArray = term.toString().split('');

      if (data) {
        data.map(function(val){

          let index = publicUtil.isexits(termArray, val.term);

          if (index != -1) {

            if (num < val.sp) {
              num = val.sp;
              result = val.sp;
            }
          }
        })


      }
      return Number(result);
    }

    /**
     * 胜平负
     */
    function setSPF(sourcesData, importData, arr){

      sourcesData.termList.map(function(term){

        let otherData = importData && importData.termList || [];

        if (importData) {
          let iBall =  importData.letBall;
          // 胜
          if (term.term == 3) {


            if (iBall == -1) {

              arr[0] = Number(term.sp) +  getSp(otherData, '31')

            }

            if (iBall == -2) {
              arr[0] = Number(term.sp) + getSp(otherData, '310')
            }

            if (iBall  > 0) {
              arr[0] = Number(term.sp) + getSp(otherData, '3');
            }



          } else if (term.term == 1) { // 平

            if (iBall < 0) {
              arr[1] = Number(term.sp) + getSp(otherData, '0');
            } else {
              arr[1] = Number(term.sp) + getSp(otherData, '3');
            }
          } else {

            if (iBall < 0) {
              arr[2] = Number(term.sp) + getSp(otherData, '0');
            } else {
              if (iBall == 1) {
                arr[2] = Number(term.sp)+ getSp(otherData, '10');
              } else {
                arr[2] = Number(term.sp) + getSp(otherData, '310')
              }
            }
          }
        } else {

          if (term.term == 3) {
            arr[0] = term.sp;
          } else if (term.term == 1) {
            arr[1] = term.sp;
          } else {
            arr[2] = term.sp;
          }

        }


      })
    }

    /**
     * 让球胜平负
     */
    function setRQ(sourcesData, importData, arr){
      sourcesData.termList.map(function(term){

        let otherData = importData && importData .termList || [];

        if (importData) {
          let iBall = sourcesData.letBall;
          // 胜
          if (term.term == 3) {

            if (iBall == 1) {
              arr[0] = Number(term.sp) +  getSp(otherData, '1');
            }

            if (iBall == 2) {
              arr[0] = Number(term.sp) + getSp(otherData, '10')
            }

            if (iBall  < 0) {
              arr[0] = Number(term.sp) + getSp(otherData, '3');
            }

          } else if (term.term == 1) { // 平

            if (iBall < 0) {
              arr[1] = Number(term.sp) + getSp(otherData, '3');
            }  else {
              arr[1] = Number(term.sp) + getSp(otherData, '0');
            }
          } else {

            if (iBall > 0) {
              arr[2] = Number(term.sp) + getSp(otherData, '0');
            } else {
              if (iBall == -1) {
                arr[2] = Number(term.sp) + getSp(otherData, '10')
              } else  {
                arr[2] = Number(term.sp) + getSp(otherData, '310')
              }
            }
          }
        } else {

          if (term.term == 3) {
            arr[0] = term.sp;
          } else if (term.term == 1) {
            arr[1] = term.sp;
          } else {
            arr[2] = term.sp;
          }

        }


      })
    }
  },
  /**
   * 改变数组最大属性的
   * @param arr {Array} 包含对象的数组
   * @returns {Array}
   */
  changeMaxData: function(arr, sourcesData){
    let  result = -1;
    let index = 0;
    let tempData;
    let tempData2;
    let tempArray = [];
    result = arrayMax(arr);


    sourcesData.map(function(val, i){

      // 胜平负放第一位
      if (val.sign == 'spfSp') {
        tempArray[0] = val;
      } else {
        tempArray[1] = val;
      }

    })

    tempData = tempArray[result[0]] || {};

    if (result[0] == 0) {
      index = 1;
    }
    tempData2 = tempArray[index] || {};


    if (tempData.letBall == 0) {
      // 胜平负
      Array.isArray(tempData.termList) && tempData.termList.map(function(term){

        let otherData = tempData2.termList ;

        if (otherData) {
          let iBall = tempData2.letBall;
          // 胜
          if (result[1] == 0) {

            changeActive(tempData.termList, '3')
            if (iBall == -1) {
              changeActive(otherData, '31')
            }

            if (iBall == -2) {

              changeActive(otherData, '310')
            }

            if (iBall  > 0) {
              changeActive(otherData, '3')
            }



          } else if (result[1] == 1) { // 平
            changeActive(tempData.termList, '1');

            if (iBall < 0) {
              changeActive(otherData, '0');
            } else {
              changeActive(otherData, '3');
            }
          } else {
            changeActive(tempData.termList, '0');
            if (iBall < 0) {
              changeActive(otherData, '0');
            } else {
              if (iBall == 1) {
                changeActive(otherData, '10');
              } else {
                changeActive(otherData, '310')
              }
            }
          }
        } else {

          changeActive(tempData.termList, result[1] == 0 ? '3' :result[1] == 1 ? '1' : '0');

        }


      })

    } else {

      // 让球胜平负

      Array.isArray(tempData.termList) && tempData.termList.map(function(term){


        let otherData = tempData2.termList || [];

        if (otherData) {
          let iBall = tempData.letBall;

          // 胜
          if (result[1]== 0) {
            changeActive(tempData.termList, '3');
            if (iBall == 1) {

              changeActive(otherData, '1');
            }

            if (iBall == 2) {
              changeActive(otherData, '10')
            }

            if (iBall  < 0) {
              changeActive(otherData, '3');
            }

          } else if (result[1] == 1) { // 平

            changeActive(tempData.termList, '1');
            if (iBall < 0) {
              changeActive(otherData, '3');
            }  else {
              changeActive(otherData, '0');
            }
          } else {
            changeActive(tempData.termList, '0');

            if (iBall > 0) {
              changeActive(otherData, '0');
            } else {
              if (iBall == -1 ) {
                changeActive(otherData, '10')
              } else  {
                changeActive(otherData, '310')
              }
            }
          }
        } else {
          changeActive(tempData.termList,  result[1] == 0 ? '3' :result[1] == 1 ? '1' : '0');
        }


      })
    }

    return sourcesData;

    /**
     * @param arr {Array}
     * @param sign {String}
     */
    function changeActive(arr, sign){
      let termArray = sign.toString().split(''),
        num = 0, index = -1;

      arr.map(function(val, i){
        let result = publicUtil.isexits(termArray, val.term);

        val.active = false;

        if (result != -1) {
          if (num < val.sp) {
            num = val.sp;
            index = i;
          }
        }
      })

      index != -1 && (arr[index].active = true);
    }

    /**
     * @param arr {Array}
     */
    function arrayMax(arr: any) :any{
      let result = [],
        num = 0;

      arr.map(function(val, index){
        val.map(function(n, j){

          if (num < n) {
            num = n;
            result = [index, j];
          }
        })
      })

      return result;
    }
  }
}

