(function() {
  var OnlineAlertLogCtrl = function($scope, $translate, $modal, Session, API, CSV, Dialog) {
    var token = Session.getAuthority().token;
    $scope.search = {};
    // Setting info paging
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };

    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      orderBys: $app.labels.get('orderBys'),
      whenAlert: [{
          value: '',
          label: $translate('FORM.PLEASE_SELECT')
        }, {
          value: -1,
          label: $translate('LOG.ONLINE.WHEN_ALERT.NEVER')
        }, {
          value: 0,
          label: $translate('LOG.ONLINE.WHEN_ALERT.EVERYTIME')
        }, {
          value: 1,
          label: $translate('LOG.ONLINE.WHEN_ALERT.ONDAY')
        }, {
          value: 5,
          label: $translate('LOG.ONLINE.WHEN_ALERT.MAX_5')
        }, {
          value: 10,
          label: $translate('LOG.ONLINE.WHEN_ALERT.MAX_10')
        }
      ],
      howAlert: [{
          value: '',
          label: $translate('FORM.PLEASE_SELECT')
        }, {
          value: 0,
          label: $translate('LOG.ONLINE.HOW_ALERT.EMAIL_PUSH')
        }, {
          value: 1,
          label: $translate('LOG.ONLINE.HOW_ALERT.PUSH')
        }, {
          value: 2,
          label: $translate('USER.INFO.EMAIL')
        }
      ]
    };
    // Set default for request user type and partner user type
    $scope.search.reqUserType = $scope.attributes.userTypes[0].value;
    $scope.search.partnerUserType = $scope.attributes.userTypes[0].value;
    // Set default for when time
    $scope.search.whenAlert = $scope.attributes.whenAlert[0].value;
    // Set default for how time
    $scope.search.howAlert = $scope.attributes.howAlert[0].value;

    // Set default for sort, order
    $scope.search.sortBy = 1;
    $scope.search.orderBy = $scope.attributes.orderBys[0].value;

    // Search online alert
    $scope.searchOnlineAlertLog = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    //  create load data
    $scope.load = function(page) {
      var reqDataSearchOnlineAlert = {
        api: 'search_log_onl_alt',
        token: token,
        // requset
        req_id: $scope.search.reqUserId,
        req_user_type: parseIntNullable($scope.search.reqUserType),
        req_email: ($scope.search.reqUserType === '' ? null : $scope.search.reqAccount),
        req_cm_code: $scope.search.reqCmCode,
        // partner
        partner_id: $scope.search.partnerUserId,
        partner_user_type: parseIntNullable($scope.search.partnerUserType),
        partner_email: ($scope.search.partnerUserType === '' ? null : $scope.search.partnerAccount),
        partner_cm_code: $scope.search.partnerCmCode,

        from_time: new LocalTime($scope.search.fromTime).toString(),
        to_time: new LocalTime($scope.search.toTime).endOfDay().toString(),
        alt_type: parseIntNullable($scope.search.howAlert),
        alt_fre: parseIntNullable($scope.search.whenAlert),
        sort: parseIntNullable($scope.search.sortBy),
        order: parseIntNullable($scope.search.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };
      
      API.call(reqDataSearchOnlineAlert).then(function(data) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = data.total;
        $scope.data = data.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    // Export to CSV
    $scope.exportCSV = function() {
      var reqDataExportCSV = {
        api: 'search_log_onl_alt',
        token: token,
        // requset
        req_id: $scope.search.reqUserId,
        req_user_type: parseIntNullable($scope.search.reqUserType),
        req_email: ($scope.search.reqUserType === '' ? null : $scope.search.reqAccount),
        req_cm_code: $scope.search.reqCmCode,
        // partner
        partner_id: $scope.search.partnerUserId,
        partner_user_type: parseIntNullable($scope.search.partnerUserType),
        partner_email: ($scope.search.partnerUserType === '' ? null : $scope.search.partnerAccount),
        partner_cm_code: $scope.search.partnerCmCode,

        from_time: new LocalTime($scope.search.fromTime).toString(),
        to_time: new LocalTime($scope.search.toTime).endOfDay().toString(),
        alt_type: parseIntNullable($scope.search.howAlert),
        alt_fre: parseIntNullable($scope.search.whenAlert),
        sort: parseIntNullable($scope.search.sortBy),
        order: parseIntNullable($scope.search.orderBy),
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

  OnlineAlertLogCtrl.$inject = ['$scope', '$translate', '$modal', 'Session', 'API', 'CSV', 'Dialog'];
  $app.controllers.controller('OnlineAlertLogCtrl', OnlineAlertLogCtrl);
})();