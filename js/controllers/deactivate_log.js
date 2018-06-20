(function() {
  var DeactivateLogCtrl = function($scope, $modal, Session, API, CSV, Dialog) {
    var token = Session.getAuthority().token;
    $scope.setting = {
      itemsPerPage : $app.pageSize,
      numberPagesDisplay : $app.pageDisplay,
      currentPage : 1,
      totalItems : 0
    };
    
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      orderBys: $app.labels.get('orderBys')
    };
    // default display
    $scope.input = {
      userType : $scope.attributes.userTypes[0].value,
      sort : 1,
      order : $scope.attributes.orderBys[0].value
    };

    $scope.data = new Array();

    $scope.startSearch = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      if ($scope.input.userType === $scope.attributes.userTypes[0].value) {
        $scope.input.account = null;
      }
      
      API.call({
        api : 'search_log_deactivate',
        token : token,
        id : $scope.input.userId, 
        from_time : new LocalTime($scope.input.fromDate).toString(),
        to_time : new LocalTime($scope.input.toDate).endOfDay().toString(),
        user_type : parseIntNullable($scope.input.userType) > -1 ? parseIntNullable($scope.input.userType) : null,
        email : $scope.input.account,
        sort : parseIntNullable($scope.input.sort),
        order : parseIntNullable($scope.input.order),
        skip : parseIntNullable($scope.setting.itemsPerPage * (page - 1)),
        take : $scope.setting.itemsPerPage,
        cm_code : $scope.input.cm
      }).then(function(data) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = data.total;
        $scope.data = data.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    $scope.exportCSV = function() {
      var reqDataExportCSV = {
        api : 'search_log_deactivate',
        token : token,
        id : $scope.input.userId, 
        from_time : new LocalTime($scope.input.fromDate).toString(),
        to_time : new LocalTime($scope.input.toDate).endOfDay().toString(),
        user_type : parseIntNullable($scope.input.userType) > -1 ? parseIntNullable($scope.input.userType) : null,
        email : $scope.input.account,
        sort : parseIntNullable($scope.input.sort),
        order : parseIntNullable($scope.input.order),
        cm_code : $scope.input.cm,
        csv : $app.timezone
      };
      
      CSV.get(reqDataExportCSV).then(function() {
        
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

  DeactivateLogCtrl.$inject = [ '$scope', '$modal', 'Session', 'API', 'CSV', 'Dialog' ];
  $app.controllers.controller('DeactivateLogCtrl', DeactivateLogCtrl); 
  
})();
