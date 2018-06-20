(function() {
  var WinkLogCtrl = function($scope, $translate, $modal, Session, API, Dialog, CSV) {
    var token = Session.getAuthority().token;
    $scope.wink_log = {};
    
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };
    
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      sortBys: [{
          value: 1,
          label: $translate('LOG.WINK.TIME')
        }
      ],
      orderBys: $app.labels.get('orderBys')
    };
    $scope.wink_log.reqUserType = $scope.attributes.userTypes[0].value;
    $scope.wink_log.partnerUserType = $scope.attributes.userTypes[0].value;
    $scope.wink_log.sortBy = $scope.attributes.sortBys[0].value;
    $scope.wink_log.orderBy = $scope.attributes.orderBys[0].value;
    
    // Search report user
    $scope.searchWinkLog = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      if ($scope.wink_log.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.wink_log.reqAccount = null;
      }
      
      if ($scope.wink_log.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.wink_log.partnerAccount = null;
      }
      
      var reqDataSearchWinkLog = {
        api: 'search_log_wink',
        token: token,
        req_id: $scope.wink_log.reqUserId,
        req_user_type: parseIntNullable($scope.wink_log.reqUserType),
        req_email: $scope.wink_log.reqAccount,
        req_cm_code: $scope.wink_log.reqCmCode,

        partner_id: $scope.wink_log.partnerUserId,
        partner_user_type: parseIntNullable($scope.wink_log.partnerUserType),
        partner_email: $scope.wink_log.partnerAccount,
        partner_cm_code: $scope.wink_log.partnerCmCode,

        from_time: new LocalTime($scope.wink_log.fromTime).toString(),
        to_time: new LocalTime($scope.wink_log.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.wink_log.sortBy),
        order: parseIntNullable($scope.wink_log.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };
      
      API.call(reqDataSearchWinkLog).then(function(wink) {
        $scope.setting.totalItems = wink.total;
        $scope.winkLogs = wink.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    $scope.exportCSV = function() {
      if ($scope.wink_log.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.wink_log.reqAccount = null;
      }
      
      if ($scope.wink_log.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.wink_log.partnerAccount = null;
      }
      
      var reqDataExportCSV = {
        api: 'search_log_wink',
        token: token,
        req_id: $scope.wink_log.reqUserId,
        req_user_type: parseIntNullable($scope.wink_log.reqUserType),
        req_email: $scope.wink_log.reqAccount,
        req_cm_code: $scope.wink_log.reqCmCode,

        partner_id: $scope.wink_log.partnerUserId,
        partner_user_type: parseIntNullable($scope.wink_log.partnerUserType),
        partner_email: $scope.wink_log.partnerAccount,
        partner_cm_code: $scope.wink_log.partnerCmCode,

        from_time: new LocalTime($scope.wink_log.fromTime).toString(),
        to_time: new LocalTime($scope.wink_log.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.wink_log.sortBy),
        order: parseIntNullable($scope.wink_log.orderBy),
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
  
  WinkLogCtrl.$inject = ['$scope', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('WinkLogCtrl', WinkLogCtrl);
})();