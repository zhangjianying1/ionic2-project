import {footballUtil} from './footballutil';


// 全局
export var publicUtil = {
    /**
     * 缓存数据
     */
    store: {
      setData: function(key, data){

        if (typeof data != 'string') {
          try {
            data = JSON.stringify(data);

          } catch (e) {

          }
        }
        localStorage.setItem(key, data);
      },
      getData: function(key){

        let result = localStorage.getItem(key);

        if (!result) return ''

        try {
          result = JSON.parse(result);

        } catch (e) {

        } finally{
          return result;
        }


      }
    },

/**
 * 生成好识别的数字 例：（23,333,333元）
 * @param num {Number}
 * @return
 */
filterNumber: function(num: string){

  var num = num + '';
  var index = num.indexOf('.');

  var endStr = num.substring(index);
  var result = '';

  if (index > -1) {
    num = num.substring(0, index);
  }

  var tempArr = num.split('');
  tempArr = tempArr.reverse();
  var i = tempArr.length;
  while (i--) {
    result += tempArr[i];
    if ((i % 3 == 0 && i != 0)) {
      result += ','
    }

  }
  if (index > -1) {
    result = result + endStr;
  }
  return result;
},
/**
 * 解析并重构成页面可用的渲染数据
 * @param data {Object} 源数据
 */
serializeData: function (data: any){


  if (data.lotteryCode == '200') {
    footballUtil.serializeFootball(data, '');
  }

  return data;

},
serializeOrderList: function(orderList){

  orderList.map(function(val){

    if (val.lotteryCode == '200') {
      footballUtil.serializeFootball(val, '');
    }


    val.bonusAmount = publicUtil.filterNumber(val.bonusAmount);
    //val.numberInfo && val.numberInfo.map(function(number){
    //  number.numbers = fcUtil.splitBoll(number.number, val.bonusNumber) ;
    //})

  });

  return orderList;
},




/**
 * 获取投注号码
 */
getNumberList: function(data){
  var result;
  switch (data.lotteryCode) {
    case '001':
      //result = fcUtil.getNumberList(data.ticketList, data.multiple, data.lotteryCode);
      break;
    case '113':
      //result = fcUtil.getNumberList(data.ticketList, data.multiple, data.lotteryCode);
      break;
    case '200':
      result = footballUtil.getNumberList(data.ticketList[0])
      break;
    // default
  }

  return result;
},
validateNumber: function(data){
  var result;

  switch (data.lotteryCode) {
    case '001':
      //result = fcUtil.validataNumber(data, {issue: {msg: '期次不能为空'}, multiple: {msg: '倍数不能为空'}, orderAmount: {msg: '订单金额不能为空'}, ticketList: {}});
      break;

    case '200':
      //result = footballUtil.validateFootball(data.ticketList[0].matchList);
      break;

    // default
  }
  return result;

},
isexits: function(arr, val){
  var bBtn = -1;

  arr.map(function(o, index){

    if (val == o) {
      bBtn = index;
    }
  })

  return bBtn;
},
/**
 * 是不是对象
 */
isObject: function(obj){
  return obj.toString() == "[object Object]"
},

/**
 * 获取二维数组最小的数组
 * @params arr{Array} 纯Number类型元素
 * @param sign {String} 是找最小数组还是最大数组 'min' =》 最小数组 'max' => 最大数组
 * @returns result {Number} 所在位置的索引
 */
getArrayIndex: function(arr, sign){
  var result = 0;
  var num = (sign === 'min') ? 100000000 : -1;


  arr.map(function(val, i){

    if ((sign == 'min' && val < num) || (sign == 'max' && val > num)) {
      num = val;
      result = i;
    }
  })

  return result;
},
/**
 * 组合
 */
combination: function(arr, n) { // z is max count
  let z=1000000;
  var r = [];

  fn([], arr, n);
  return r;
  function fn(t, a, n) {
    if (n === 0 || z && r.length == z) {
      return r[r.length] = t;
    }
    for (var i = 0, l = a.length - n; i <= l; i++) {
      if (!z || r.length < z) {
        var b = t.slice();
        b.push(a[i]);
        fn(b, a.slice(i + 1), n - 1);
      }
    }
  }
}
}
;
