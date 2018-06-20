(function() {
  var SaleStatisticCtrl = function($scope, $filter, API, Session, Dialog) {
    $scope.today = $scope.selectedDateDay =  Date.today();
    $scope.minDateApp = LocalTime.from($app.minDateInSaleStatistics).time;

    var minDateChange = LocalTime.from($app.minDateInSaleStatistics).time;
    var todayChange = Date.today();
    $scope.selectiveDate = new Array;

    while (minDateChange.getTime() <= todayChange.getTime()) {
      $scope.selectiveDate.push($filter('date')(minDateChange, $app.format.month));

      minDateChange.setMonth(minDateChange.getMonth() + 1);

    }
    $scope.selectedDate = $scope.selectiveDate[$scope.selectiveDate.length - 1];
    $scope.type = 1;

    $scope.displayByType = function() {
      var minDateChange = LocalTime.from($app.minDateInSaleStatistics).time;
      var todayChange = Date.today();
      var typeChange = parseIntNullable($scope.type);
      $scope.selectiveDate = new Array;
      switch (typeChange) {
        case 1:
          while (minDateChange.getTime() <= todayChange.getTime()) {
            $scope.selectiveDate.push($filter('date')(minDateChange, $app.format.month));

            minDateChange.setMonth(minDateChange.getMonth() + 1);
          }
            $scope.selectedDate = $scope.selectiveDate[$scope.selectiveDate.length - 1];
            $scope.load();
           break;
        case 2:

          $scope.selectiveDate.push($filter('date')(minDateChange, 'yyyy'));

          while (minDateChange.getFullYear() < todayChange.getFullYear()) {
            minDateChange.setFullYear(minDateChange.getFullYear() + 1);

            $scope.selectiveDate.push($filter('date')(minDateChange, 'yyyy'));
          }
          $scope.selectedDate = $scope.selectiveDate[$scope.selectiveDate.length - 1];
          $scope.load();
          break;
        case 3:
          $scope.selectedDateDay =  Date.today();
        }
    };

    $scope.changeDate = function(offset) {
      var type = parseIntNullable($scope.type);
      if (type == 3) {
        var time = new Date($scope.selectedDateDay);
        time.setDate(time.getDate() + offset);
        $scope.selectedDateDay = time;
      } else {
        var index = $scope.selectiveDate.indexOf($scope.selectedDate);
        var newIndex = index + offset;
        if(newIndex >= 0 && newIndex < $scope.selectiveDate.length) {
          $scope.selectedDate = $scope.selectiveDate[newIndex];
          $scope.load();
        }
      }
    };

    $scope.selectorChange = function(type) {
      var type = parseIntNullable($scope.type);
      if (type == 3) {
        $scope.selectedDate = $scope.selectedDateDay;
        if (($scope.selectedDate.getTime() > $scope.today.getTime()) || ($scope.selectedDate.getTime() < $scope.minDateApp.getTime())) {
          return;
        }

      }
      $scope.load();
    };

    $scope.load = function() {
      var type = parseIntNullable($scope.type);
      API.call({
        api: 'transaction_statistic',
        token: Session.getAuthority().token,
        statistic_time: type == 3 ?  $filter('date')($scope.selectedDate,'yyyy/MM/dd') : $scope.selectedDate,
        time_zone: $app.timezone,
        type: type
      }).then(function(data) {
        switch (type) {
          case 1:
            displayMonthView(data);
            break;
          case 2:
            displayYearView(data);
            break;
          case 3:
            displayDayView(data);
        };
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    var displayMonthView = function(data) {
      // create day-table
      $scope.time = new Date($scope.selectedDate+"/01");
      var daysInMonth = $scope.time.getDaysInMonth();

      var rows = new Array();
      for (var i = 0; i < daysInMonth; i++) {
        rows.push({
          text: i + 1
        });
      }

      for (var i = 0; i < data.length; i++) {
        try {
          var localTime = LocalTime.from(data[i].time);
          var date = localTime.time.getDate();
          for (var prop in data[i]) {
            rows[date - 1][prop] = data[i][prop];
          }
        } catch (e) {
        }
      }

      $scope.rows = rows;
    };

    var displayYearView = function(data) {
      var rows = new Array();
      for (var i = 0; i < 12; i++) {
        rows.push({
          text: i + 1
        });
      }

      for (var i = 0; i < data.length; i++) {
        try {
          for (var prop in data[i]) {
            rows[i][prop] = data[i][prop];
          }
        } catch (e) {
        }
      }

      $scope.rows = rows;
    };
    var displayDayView = function(data) {
      var rows = new Array();
      // create hour-table
      for (var i = 0; i < 24; i++) {
        rows.push({
          text : (100 + i).toString().substr(1, 2) + ' - ' + (101 + i).toString().substr(1, 2)
        });
      }
      for (var i = 0; i < data.length; i++) {
        var localTime = LocalTime.from(data[i].time, true);

        var hour = localTime.time.getUTCHours();
        for ( var prop in data[i]) {
          rows[hour][prop] = data[i][prop];
        }
      }

      $scope.rows = rows;
    }
  };

  SaleStatisticCtrl.$inject = ['$scope', '$filter', 'API', 'Session', 'Dialog'];

  $app.controllers.controller('SaleStatisticCtrl', SaleStatisticCtrl);
})();
