(function() {
  var CmCodeStatisticCtrl = function($scope, Session, API, Dialog) {
    $scope.rows = null;
    $scope.total = null;
    $scope.search = function() {
      API.call({
        api : 'cm_code_statistic',
        token : Session.getAuthority().token,
        from_time : new LocalTime($scope.fromDate).toString(),
        to_time : new LocalTime($scope.toDate).endOfDay().toString()
      }).then(function(data) {
        $scope.total = new Object;
        for (var i = 0; i < data.length; i++) {
          for ( var key in data[i]) {
            $scope.total[key] = $scope.total[key] || 0;

            $scope.total[key] += data[i][key];
          }
        }

        $scope.rows = data;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    }
  };

  CmCodeStatisticCtrl.$inject = [ '$scope', 'Session', 'API', 'Dialog' ];
  $app.controllers.controller('CmCodeStatisticCtrl', CmCodeStatisticCtrl);
})();