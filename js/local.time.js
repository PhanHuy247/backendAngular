(function() {
  LocalTime = function(time, keepTime) {
    this.time = time;
    this.keepTime = keepTime || false;

    if (!this.keepTime && isSet(this.time)) {
      this.time.setHours(0);
      this.time.setMinutes(0);
      this.time.setSeconds(0);
    }
  };
  LocalTime.from = function(str, keepTime) {
    var time = parseDate(str);
    return new LocalTime(time, keepTime);
  };
  LocalTime.formats = {
    yyyy : 'yyyy'.length,
    yyyyMM : 'yyyyMM'.length,
    yyyyMMdd : 'yyyyMMdd'.length,
    yyyyMMddHHmm : 'yyyyMMddHHmm'.length,
    yyyyMMddHHmmss : 'yyyyMMddHHmmss'.length
  };
  // extend Date object
  Date.today = function() {
    var time = new Date();
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);

    return time;
  };
  Date.now = function() {
    return new Date();
  };
  Date.timezone = function() {
    var minuteOffset = Date.now().getTimezoneOffset();

    return -(minuteOffset / 60);
  };
  Date.prototype.getDaysInMonth = function() {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
  };
  Date.prototype.local = function(take) {
    var str = '';
    for ( var prop in parserProps) {
      str += (this['get' + prop]() + parserProps[prop].offset + 10000).toString().substr(5 - parserProps[prop].take, parserProps[prop].take);
    }

    if (isSet(take)) {
      return str.substr(0, take);
    } else {
      return str;
    }
  };
  Date.prototype.utc = function(take) {
    var str = '';
    for ( var prop in parserProps) {
      str += (this['getUTC' + prop]() + parserProps[prop].offset + 10000).toString().substr(5 - parserProps[prop].take, parserProps[prop].take);
    }

    if (isSet(take)) {
      return str.substr(0, take);
    } else {
      return str;
    }
  };
  Date.prototype.endOfDay = function () {
    this.setHours(23);
    this.setMinutes(59);
    this.setSeconds(59);
    
    return this;
  };

  LocalTime.prototype = new Object;
  LocalTime.prototype.toString = function(take) {
    if (isSet(this.time)) {
      return this.time.utc(take);
    } else {
      return null;
    }
  };
  LocalTime.prototype.endOfDay = function() {
    if (isSet(this.time)) {
      this.time.endOfDay();
    }
    return this;
  };

  var parserProps = {
    'FullYear' : {
      from : 0,
      take : 4,
      offset : 0
    },
    'Month' : {
      from : 4,
      take : 2,
      offset : 1
    },
    'Date' : {
      from : 6,
      take : 2,
      offset : 0
    },
    'Hours' : {
      from : 8,
      take : 2,
      offset : 0
    },
    'Minutes' : {
      from : 10,
      take : 2,
      offset : 0
    },
    'Seconds' : {
      from : 12,
      take : 2,
      offset : 0
    }
  };

  var parseDate = function(str) {

    // check format
    // yyyyMMdd or yyyyMMddhhmmss
    for (var i = str.length; i < LocalTime.formats.yyyyMMddHHmmss; i++) {
      str += '0';
    }

    var time = new Date();
    time['setUTCDate'](1);
    for ( var prop in parserProps) {
      var parsedValue = parseInt(str.substr(parserProps[prop].from, parserProps[prop].take), 10);

      time['setUTC' + prop](parsedValue - parserProps[prop].offset);
    }

    return time;
  };

})();