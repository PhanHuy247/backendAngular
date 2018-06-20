(function() {
  var ReportUserCtrl = function($scope, $modal, Session, API, Dialog, CSV) {
    // string token
    var token = Session.getAuthority().token;
    $scope.report_user = {};

    // Setting info paging
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };

    // defined an array report type
    $scope.attributes = {
      reportTypes: $app.labels.get('reportTypes', true),
      userTypes: $app.labels.get('userTypes', true),
      orderBys: $app.labels.get('orderBys')
    };
    // default value user type of both part: Request, partner, report type
    $scope.report_user.reqUserType = $scope.attributes.userTypes[0].value;
    $scope.report_user.partnerUserType = $scope.attributes.userTypes[0].value;
    $scope.report_user.reportType = $scope.attributes.reportTypes[0].value;
    $scope.report_user.orderBy = $scope.attributes.orderBys[0].value;
    $scope.report_user.sortBy = 1;

    // Search report user
    $scope.searchReportUser = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      if ($scope.report_user.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_user.reqAccount = null;
      }
      
      if ($scope.report_user.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_user.partnerAccount = null;
      }
      
      var reqDataSearchUser = {
        api: 'search_rpt_user',
        token: token,
        req_id: $scope.report_user.reqUserId,
        req_user_type: parseIntNullable($scope.report_user.reqUserType),
        req_email: $scope.report_user.reqAccount,
        req_cm_code: $scope.report_user.reqCmCode,

        partner_id: $scope.report_user.partnerUserId,
        partner_user_type: parseIntNullable($scope.report_user.partnerUserType),
        partner_email: $scope.report_user.partnerAccount,
        partner_cm_code: $scope.report_user.partnerCmCode,

        from_time: new LocalTime($scope.report_user.fromTime).toString(),
        to_time: new LocalTime($scope.report_user.toTime).endOfDay().toString(),
        rpt_type: parseIntNullable($scope.report_user.reportType),
        sort: parseIntNullable($scope.report_user.sortBy),
        order: parseIntNullable($scope.report_user.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchUser).then(function(user) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = user.total;
        $scope.userList = user.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    $scope.exportCSV = function() {
      if ($scope.report_user.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_user.reqAccount = null;
      }
      
      if ($scope.report_user.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_user.partnerAccount = null;
      }
      
      var reqDataExportCSV = {
        api: 'search_rpt_user',
        token: token,
        req_id: $scope.report_user.reqUserId,
        req_user_type: parseIntNullable($scope.report_user.reqUserType),
        req_email: $scope.report_user.reqAccount,
        req_cm_code: $scope.report_user.reqCmCode,

        partner_id: $scope.report_user.partnerUserId,
        partner_user_type: parseIntNullable($scope.report_user.partnerUserType),
        partner_email: $scope.report_user.partnerAccount,
        partner_cm_code: $scope.report_user.partnerCmCode,

        from_time: new LocalTime($scope.report_user.fromTime).toString(),
        to_time: new LocalTime($scope.report_user.toTime).endOfDay().toString(),
        rpt_type: parseIntNullable($scope.report_user.reportType),
        sort: parseIntNullable($scope.report_user.sortBy),
        order: parseIntNullable($scope.report_user.orderBy),
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

  ReportUserCtrl.$inject = ['$scope', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('ReportUserCtrl', ReportUserCtrl);
})();