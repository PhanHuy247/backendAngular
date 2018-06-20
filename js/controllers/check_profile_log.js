(function() {
  var CheckProfileLogCtrl = function($scope, $translate, $modal, Session, API, Dialog, CSV) {
    var token = Session.getAuthority().token;
    $scope.check_profile = {};
    
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
          label: $translate('LOG.CHECK_PROFILE.TIME')
        }
      ],
      orderBys: $app.labels.get('orderBys')
    };
    $scope.check_profile.reqUserType = $scope.attributes.userTypes[0].value;
    $scope.check_profile.partnerUserType = $scope.attributes.userTypes[0].value;
    $scope.check_profile.sortBy = $scope.attributes.sortBys[0].value;
    $scope.check_profile.orderBy = $scope.attributes.orderBys[0].value;
    
    // Search report user
    $scope.searchCheckProfile = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      if ($scope.check_profile.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.check_profile.reqAccount = null;
      }
      
      if ($scope.check_profile.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.check_profile.partnerAccount = null;
      }
      
      var reqDataSearchCheckProfile = {
        api: 'search_log_check',
        token: token,
        req_id: $scope.check_profile.reqUserId,
        req_user_type: parseIntNullable($scope.check_profile.reqUserType),
        req_email: $scope.check_profile.reqAccount,
        req_cm_code: $scope.check_profile.reqCmCode,

        partner_id: $scope.check_profile.partnerUserId,
        partner_user_type: parseIntNullable($scope.check_profile.partnerUserType),
        partner_email: $scope.check_profile.partnerAccount,
        partner_cm_code: $scope.check_profile.partnerCmCode,

        from_time: new LocalTime($scope.check_profile.fromTime).toString(),
        to_time: new LocalTime($scope.check_profile.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.check_profile.sortBy),
        order: parseIntNullable($scope.check_profile.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };
      
      API.call(reqDataSearchCheckProfile).then(function(profile) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = profile.total;
        $scope.checkProfiles = profile.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    $scope.exportCSV = function() {
      if ($scope.check_profile.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.check_profile.reqAccount = null;
      }
      
      if ($scope.check_profile.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.check_profile.partnerAccount = null;
      }
      
      var reqDataExportCSV = {
        api: 'search_log_check',
        token: token,
        req_id: $scope.check_profile.reqUserId,
        req_user_type: parseIntNullable($scope.check_profile.reqUserType),
        req_email: $scope.check_profile.reqAccount,
        req_cm_code: $scope.check_profile.reqCmCode,

        partner_id: $scope.check_profile.partnerUserId,
        partner_user_type: parseIntNullable($scope.check_profile.partnerUserType),
        partner_email: $scope.check_profile.partnerAccount,
        partner_cm_code: $scope.check_profile.partnerCmCode,

        from_time: new LocalTime($scope.check_profile.fromTime).toString(),
        to_time: new LocalTime($scope.check_profile.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.check_profile.sortBy),
        order: parseIntNullable($scope.check_profile.orderBy),
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
  
  CheckProfileLogCtrl.$inject = ['$scope', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('CheckProfileLogCtrl', CheckProfileLogCtrl);
})();