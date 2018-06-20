commonLog = {
  convertUserType: function(data, $translate) {
    var convert = '';
    if (data == 0) {
      convert = $translate('LOG.COMMON.FACEBOOK_COMBOBOX');
    } else {    
      convert = $translate('LOG.COMMON.EMAIL');
    }
    return convert;
  },
  convertWhenTo: function(data, $translate) {
    var convert = '';
    if (data == -1) {
      convert = $translate('LOG.ONLINE.ALT_FRE.NEVER');
    } else if (data == 0) {
      convert = $translate('LOG.ONLINE.ALT_FRE.EVERYTIME');
    } else if (data == 1) {
      convert = $translate('LOG.ONLINE.ALT_FRE.ONDAY');
    } else if (data == 5) {
      convert = $translate('LOG.ONLINE.ALT_FRE.MAX_5');
    } else {
      convert = $translate('LOG.ONLINE.ALT_FRE.MAX_10');
    }
    return convert;
  },
  convertHowTo: function(data, $translate) {
    var convert = '';
    if (data == -1) {
      convert = $translate('LOG.ONLINE.ALT_TYPE.EMAIL_PUSH');
    } else if (data == 0) {

      convert = $translate('LOG.ONLINE.ALT_TYPE.EMAIL');
    } else {

      convert = $translate('LOG.ONLINE.ALT_TYPE.PUSH');
    }
    return convert;
  },
  convertTimeUserLog: function(data) {
    var str = data.getFullYear().toString();
    if ((data.getMonth() + 1) < 10) {
      str += "0";
    }
    str += (data.getMonth() + 1).toString();
    if (data.getDate() < 10) {
      str += "0";
    }
    str += data.getDate();
    return str;
  },
  pagingCtrl: function(data) {
    return 20;
  },
  numberPageCtrl: function(data) {
    return 6;
  },
  convertTimeFull: function(data) {
    data = parseInt(data);
    var ml = data % 100;
    var min = ((data - ml) / 100) % 100;
    var hh = (data - (min * 100 + ml)) % 10000;
    hh = (hh + 100).toString().substr(1, 2);
    min = (min + 100).toString().substr(1, 2);
    ml = (ml + 100).toString().substr(1, 2);
    var _time = parseInt((data - ml - min * 100 - hh * 10000) / 1000000);
    var day = _time % 100;
    var month = ((_time - day) / 100) % 100;
    var year = (_time - (month * 100 + day)) / 10000;
    var convertTime = day.toString() + "/" + month.toString() + "/" + year.toString() + " " + hh.toString() + ":" + min.toString() + ":" + ml.toString();
    return convertTime;
  }
};






