(function() {
  var UserStatisticCtrl = function($scope, $filter, API, Session, Dialog) {
    var minDate = LocalTime.from($app.minDateInSaleStatistics).time;
    var today = Date.today();

    $scope.selectiveMonths = new Array;

    while (minDate.getTime() <= today.getTime()) {
      $scope.selectiveMonths.push({
        label : $filter('date')(minDate, $app.format.month),
        value : angular.copy(minDate)
      });

      minDate.setMonth(minDate.getMonth() + 1);
    }

    $scope.selectedMonthIndex = $scope.selectiveMonths.length - 1;

    $scope.type = 1; // default is month view
    $scope.time = Date.today();

    $scope.changeDate = function(offset) {
      if ($scope.type == 0) {
        var time = new Date($scope.time.getTime());
        time.setDate(time.getDate() + offset);
        $scope.time = time;
      } else {
        var selectedMonthIndex = $scope.selectedMonthIndex
        selectedMonthIndex += offset;

        if (selectedMonthIndex < 0) {
          selectedMonthIndex = 0;
        }

        if (selectedMonthIndex > $scope.selectiveMonths.length - 1) {
          selectedMonthIndex = $scope.selectiveMonths.length - 1;
        }

        if (selectedMonthIndex != $scope.selectedMonthIndex) {
          $scope.selectedMonthIndex = selectedMonthIndex;
          $scope.load();
        }
      }
    };

    $scope.load = function() {
      var type = parseIntNullable($scope.type);
      var time = type == 0 ? $scope.time.local(LocalTime.formats.yyyyMMdd) : $scope.selectiveMonths[$scope.selectedMonthIndex].value.local(LocalTime.formats.yyyyMM);
      API.call({
        api : 'user_statistic',
        token : Session.getAuthority().token,
        statistic_type : type,
        statistic_time : time,
        time_zone : $app.timezone
      }).then(function(data) {
        if (type === 0) {
          displayDayView(data, time);
        } else {
          displayMonthView(data, time);
        }

        $scope.total = new Object;

        for (var i = 0; i < $scope.rows.length; i++) {
          for ( var prop in $scope.rows[i]) {
            if (isUnset($scope.total[prop])) {
              $scope.total[prop] = 0;
            }

            var value = isNaN($scope.rows[i][prop]) ? 0 : parseInt($scope.rows[i][prop]);

            $scope.total[prop] += value;
          }
        }
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    var displayDayView = function(data, time) {
      var selectedTime = LocalTime.from(time).time;
      var rows = new Array;

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
    };

    var displayMonthView = function(data, time) {
      time += '01';
      var selectedTime = LocalTime.from(time).time;
      var rows = new Array;

      var daysInMonth = selectedTime.getDaysInMonth();
      // create day-table
      for (var i = 0; i < daysInMonth; i++) {
        rows.push({
          text : i + 1
        });
      }

      for (var i = 0; i < data.length; i++) {
        var localTime = LocalTime.from(data[i].time);

        var date = localTime.time.getDate();

        for ( var prop in data[i]) {
          rows[date - 1][prop] = data[i][prop];
        }
      }

      $scope.rows = rows;
    };
  };

  UserStatisticCtrl.$inject = [ '$scope', '$filter', 'API', 'Session', 'Dialog' ];

  $app.controllers.controller('UserStatisticCtrl', UserStatisticCtrl);
})();
