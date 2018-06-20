(function() {
  var LookAtMeLogCtrl = function($scope, $translate, $modal, Session, API, CSV, Dialog) {
    var token = Session.getAuthority().token;

    $scope.properties = {
      totalItems : 0,
      currentPage : 1,
      itemsPerPage : $app.pageSize,
      numberPagesDisplay : $app.pageDisplay,
      userTypes : $app.labels.get('userTypes', true),
      sort : [ {
        value : 1,
        label : $translate('LOG.LOOK_AT_ME.PLACE_BID_TIME')
      }, {
        value : 2,
        label : $translate('LOG.LOOK_AT_ME.USED_POINT')
      }],
      orderBys: $app.labels.get('orderBys')
    };

    $scope.input = {
      sort : $scope.properties.sort[0].value,
      order : $scope.properties.orderBys[0].value,
      userType : $scope.properties.userTypes[0].value
    };

    $scope.beginSearch = function() {
      $scope.properties.totalItems = 0;
      $scope.properties.currentPage = 1;
      $scope.load($scope.properties.currentPage);
    };

    $scope.load = function(page) {
      API.call({
        api : 'search_log_look',
        token : token,
        id : $scope.input.id,
        user_type : $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.userType : null,
        email : $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.email : null,
        cm_code : $scope.input.cmCode,
        from_time : new LocalTime($scope.input.fromTime).toString(),
        to_time : new LocalTime($scope.input.toTime).endOfDay().toString(),
        from_point : parseIntNullable($scope.input.from_point),
        to_point : parseIntNullable($scope.input.to_point),
        sort : $scope.input.sort,
        order : parseIntNullable($scope.input.order),
        skip : $scope.properties.itemsPerPage * (page - 1),
        take : $scope.properties.itemsPerPage
      }).then(function(response) {
        $scope.properties.totalItems = response.total;
        $scope.log = response.list;
      }, function(code) {
        Dialog.error(code);
      });
    };
    
    $scope.exportCSV = function() {
      var reqDataExportCSV = {
        api : 'search_log_look',
        token : token,
        id : $scope.input.id,
        user_type : $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.userType : null,
        email : $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.email : null,
        cm_code : $scope.input.cmCode,
        from_time : new LocalTime($scope.input.fromTime).toString(),
        to_time : new LocalTime($scope.input.toTime).endOfDay().toString(),
        from_point : parseIntNullable($scope.input.from_point),
        to_point : parseIntNullable($scope.input.to_point),
        sort : $scope.input.sort,
        order : parseIntNullable($scope.input.order),
        csv : $app.timezone//Date.timezone()
      };
      
      CSV.get(reqDataExportCSV).then(function(res) {
        console.log(res);
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    /*$scope.userDetail = function(userId) {
      $modal.open({
        templateUrl : 'partials/common/dialog_user_detail.html',
        controller : $app.UserDetailCtrl,
        windowClass : 'user-detail-modal',
        resolve : {
          userId : function() {
            return userId;
          }
        }
      });
    };*/
  };

  LookAtMeLogCtrl.$inject = [ '$scope', '$translate', '$modal', 'Session', 'API', 'CSV', 'Dialog' ];
  $app.controllers.controller('LookAtMeLogCtrl', LookAtMeLogCtrl);
})();