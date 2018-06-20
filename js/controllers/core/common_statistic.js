commonStatistic = {
  convertTime : function(day, month, year, type) {
  var str = year.toString();
  if (month < 10) {
    str += "0";
  }
  str += month.toString();
  if (type == 0) {
    if (day < 10)
    {
      str += "0";
    }
    str += day.toString();
  }
  return str;
},
parseTime : function(type, time) {
  var map = {};
  var _time = parseInt(time);
  if (type == 0) {

    map.day = _time % 100;
    map.month = ((_time - map.day) / 100) % 100;
    map.year = (_time - map.day - map.month * 100) / 10000;
  } else {  
    map.month = _time % 100;
    map.year = (_time - map.month) / 100;
  }
  return map;
},

convertTimeLabel : function(type, _selected, day, month, year, _countday) {
  var map = {};
  if (type == 0) {
    if (day + _selected > _countday) {
      if (month == 12) {
        map.time = (year + 1).toString() + '0101';
        map.value = (year + 1).toString() + '/01/01';
        map.day = 1;
        map.month = 1;
        map.year = (year + _selected);
      } else {      
        var convert = commonStatistic.convertTime(1, month + 1, year, 0);
        map.time = convert;
        map.day = 1;
        map.month = month + _selected;
        map.year = year;
        var _value = '';
        if(month + 1 <10){
          _value = '0' + (month + 1).toString();
        } else {
          _value = (month + 1).toString();
        }
        map.value = year.toString() + "/" + _value + "/01";
      }
    } else if (day + _selected == 0) {    
      if (month == 1) {
        var countDay = new Date(year + _selected, 12, 0).getDate();
        var convert = commonStatistic.convertTime(countDay, 12, year + _selected, 0);
        map.time = convert;
        map.day = countDay;
        map.month = 12;
        map.year = year + _selected;
        map.value = (year + _selected).toString() + '/12/' + countDay.toString();
      } else {      
        var countDay = new Date(year, month + _selected, 0).getDate();
        var convert = commonStatistic.convertTime(countDay, month + _selected, year, 0);
        map.time = convert;
        map.day = countDay;
        map.month = month + _selected;
        map.year = year;
        var _value = '';
        if(month + 1 <10){
          _value = '0' + (month + 1).toString();
        } else {
          _value = (month + 1).toString();
        }
        map.value = year.toString() + "/" + _value + "/" + countDay;
      }
    } else {
      var convert = commonStatistic.convertTime(day + _selected, month, year, 0);
      map.time = convert;
      map.day = day + _selected;
      map.month = month;
      map.year = year;
      if(month <10){
        month ='0'+ month.toString();
      }
       var _value = '';
      if(day + _selected <10){
        _value = '0' + (day + _selected).toString();
      } else {
      
        _value = (day + _selected).toString();
      }
      map.value = year.toString() + "/" + month + "/" + _value;
    }

  } else {  
    if (month + _selected > 12) {
      var convert = commonStatistic.convertTime(1, 1, year + _selected, 1);
      map.time = convert;
      map.day = 1;
      map.month = 1;
      map.year = year + _selected;
      map.value = (year + _selected).toString() + "/01";
    } else if (month + _selected == 0) {    
      var convert = commonStatistic.convertTime(1, 12, year + _selected, 1);
      map.time = convert;
      map.day = 31;
      map.month = 12;
      map.year = year + _selected;
      map.value = (year + _selected).toString() + "/12";
    } else {    
      var convert = commonStatistic.convertTime(1, month + _selected, year, 1);
      map.time = convert;
      map.day = 1;
      map.month = month + _selected;
      map.year = year;
      var _value = '';
      if(month + _selected <10){
        _value = '0' + (month+_selected).toString();
      } else {
        _value = (month + _selected).toString();         
      }   
      map.value = year.toString() + "/" + _value;
    }
  }
  return  map;
},

convertDataCMCode : function(data)  {
  var map = [];
  var total = {
    cmCode: 'Total',
    android_reg_time: 0,
    android_login_time: 0,
    android_pur_times: 0,
    android_pur_money: 0,
    ios_reg_time: 0,
    ios_login_time: 0,
    ios_pur_times: 0,
    ios_pur_money: 0
  };
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (isUnset(item.android_reg_time)) {
      item.android_reg_time = 0;
    }
    if (isUnset(item.android_login_time)) {
      item.android_login_time = 0;
    }
    if (isUnset(item.android_pur_times)) {
      item.android_pur_times = 0;
    }
    if (isUnset(item.android_pur_money)) {
      item.android_pur_money = 0;
    }
    if (isUnset(item.ios_reg_time)) {
      item.ios_reg_time = 0;
    }
    if (isUnset(item.ios_login_time)) {
      item.ios_login_time = 0;
    }
    if (isUnset(item.ios_pur_times)) {
      item.ios_pur_times = 0;
    }
    if (isUnset(item.ios_pur_money)) {
      item.ios_pur_money = 0;
    }

    total.android_reg_time += item.android_reg_time;
    total.android_login_time += item.android_login_time;
    total.android_pur_times += item.android_pur_times;
    total.android_pur_money += item.android_pur_money;
    total.ios_reg_time += item.ios_reg_time;
    total.ios_login_time += item.ios_login_time;
    total.ios_pur_times += item.ios_pur_times;
    total.ios_pur_money += item.ios_pur_money;
    map.push(item);
  }
  map.push(total);
  return map;
}
};
