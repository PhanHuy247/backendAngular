(function() {
  var ShakeChatLogCtrl = function($scope, $translate, $modal, Session, API, Dialog, CSV) {
    var token = Session.getAuthority().token;
    $scope.shake_chat = {};
    $scope.setting = {
      numberPagesDisplay : $app.pageDisplay,
      itemsPerPage : $app.pageSize,
      currentPage : 1,
      totalItems : 0
    };
    
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      sortBys: [{
          value: 1,
          label: $translate('LOG.SHAKE_CHAT.TIME')
        }
      ],
      orderBys: $app.labels.get('orderBys')
    };
    $scope.shake_chat.userType = $scope.attributes.userTypes[0].value;
    $scope.shake_chat.sortBy = $scope.attributes.sortBys[0].value;
    $scope.shake_chat.orderBy = $scope.attributes.orderBys[0].value;
    
    $scope.searchShakeChat = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };
    
    $scope.load = function(page) {
      if ($scope.shake_chat.userType === $scope.attributes.userTypes[0].value) {
        $scope.shake_chat.email = null;
      }
      
      var reqDataSearchShakeChat = {
        api: 'search_log_shake',
        token: token,
        id: $scope.shake_chat.userId,
        user_type: parseIntNullable($scope.shake_chat.userType),
        email: $scope.shake_chat.email,
        cm_code: $scope.shake_chat.cmCode,
        from_time: new LocalTime($scope.shake_chat.fromTime).toString(),
        to_time: new LocalTime($scope.shake_chat.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.shake_chat.sortBy),
        order: parseIntNullable($scope.shake_chat.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };
      
      API.call(reqDataSearchShakeChat).then(function(res) {
        $scope.setting.totalItems = res.total;
        $scope.shakeChatList = res.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    // Export CSV
    $scope.exportCSV = function() {
      if ($scope.shake_chat.userType === $scope.attributes.userTypes[0].value) {
        $scope.shake_chat.email = null;
      }
      
      var reqDataExportCSV = {
        api: 'search_log_shake',
        token: token,
        id: $scope.shake_chat.userId,
        user_type: parseIntNullable($scope.shake_chat.userType),
        email: $scope.shake_chat.email,
        cm_code: $scope.shake_chat.cmCode,
        from_time: new LocalTime($scope.shake_chat.fromTime).toString(),
        to_time: new LocalTime($scope.shake_chat.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.shake_chat.sortBy),
        order: parseIntNullable($scope.shake_chat.orderBy),
        csv: $app.timezone
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
  
  ShakeChatLogCtrl.$inject = ['$scope', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('ShakeChatLogCtrl', ShakeChatLogCtrl);
})();