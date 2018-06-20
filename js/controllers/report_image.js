(function() {
  var ReportImageCtrl = function($scope, $modal, Session, API, Dialog, CSV) {
    // string token
    var token = Session.getAuthority().token;
    $scope.report_image = {};
    $scope.flag = false;

    // Setting info paging
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };

    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      imageTypes: $app.labels.get('imageTypes', true),
      reportTypes: $app.labels.get('reportTypes', true),
      orderBys: $app.labels.get('orderBys')
    };
    // default value user type of both part: Request, partner
    $scope.report_image.reqUserType = $scope.attributes.userTypes[0].value;
    $scope.report_image.partnerUserType = $scope.attributes.userTypes[0].value;

    // default value option report type, image type
    $scope.report_image.type = $scope.attributes.imageTypes[0].value;
    $scope.report_image.reportType = $scope.attributes.reportTypes[0].value;

    // default value option sort by: Time, order by
    $scope.report_image.sortBy = 1;
    $scope.report_image.orderBy = $scope.attributes.orderBys[0].value;

    // Search report image
    $scope.searchReportImage = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      if ($scope.report_image.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_image.reqAccount = null;
      }

      if ($scope.report_image.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_image.partnerAccount = null;
      }

      var reqDataSearchImage = {
        api: 'search_rpt_img',
        token: token,
        req_id: $scope.report_image.reqUserId,
        req_user_type: parseIntNullable($scope.report_image.reqUserType),
        req_email: $scope.report_image.reqAccount,
        req_cm_code: $scope.report_image.reqCmCode,
        partner_id: $scope.report_image.partnerUserId,
        partner_user_type: parseIntNullable($scope.report_image.partnerUserType),
        partner_email: $scope.report_image.partnerAccount,
        partner_cm_code: $scope.report_image.partnerCmCode,
        from_time: new LocalTime($scope.report_image.fromTime).toString(),
        to_time: new LocalTime($scope.report_image.toTime).endOfDay().toString(),
        img_id: $scope.report_image.id,
        img_type: parseIntNullable($scope.report_image.type),
        rpt_type: parseIntNullable($scope.report_image.reportType),
        sort: parseIntNullable($scope.report_image.sortBy),
        order: parseIntNullable($scope.report_image.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchImage).then(function(image) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        for (var i = 0; i < image.list.length; i++) {
          image.list[i].$checkImageStatus = function() {
            return API.call({
              api: 'get_img_inf',
              token: token,
              img_id: this.img_id
            }).then(function(response) {
              return response.img_stt;
            }, function(errorCode) {
              Dialog.error(errorCode);
            });
          };
          
          image.list[i].$reviewImage = function() {
            var deniedStatus = -1;
            var reqChangeStatusImage = {
              api: 'review_image',
              token: token,
              img_id: this.img_id,
              type: deniedStatus
            };

            return API.call(reqChangeStatusImage).then(function() {
            }, function(errorCode) {
              Dialog.error(errorCode);
            });
          };
          
          image.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
            + '&img_id=' + image.list[i].img_id + '&img_kind=2';
        }

        $scope.setting.totalItems = image.total;
        $scope.imageList = image.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    $scope.exportCSV = function() {
      if ($scope.flag) return;
      if ($scope.report_image.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_image.reqAccount = null;
      }

      if ($scope.report_image.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_image.partnerAccount = null;
      }

      
      $scope.flag = true;
      var reqDataExportCSV = {
        api: 'search_rpt_img',
        token: token,
        req_id: $scope.report_image.reqUserId,
        req_user_type: parseIntNullable($scope.report_image.reqUserType),
        req_email: $scope.report_image.reqAccount,
        req_cm_code: $scope.report_image.reqCmCode,
        
        partner_id: $scope.report_image.partnerUserId,
        partner_user_type: parseIntNullable($scope.report_image.partnerUserType),
        partner_email: $scope.report_image.partnerAccount,
        partner_cm_code: $scope.report_image.partnerCmCode,
        
        from_time: new LocalTime($scope.report_image.fromTime).toString(),
        to_time: new LocalTime($scope.report_image.toTime).endOfDay().toString(),
        img_id: $scope.report_image.id,
        img_type: parseIntNullable($scope.report_image.type),
        rpt_type: parseIntNullable($scope.report_image.reportType),
        sort: parseIntNullable($scope.report_image.sortBy),
        order: parseIntNullable($scope.report_image.orderBy),
        csv: $app.timezone
      };
      
      CSV.get(reqDataExportCSV).then(function() {
        $scope.flag = false;
      }, function(errorCode) {
        $scope.flag = false;
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

  ReportImageCtrl.$inject = ['$scope', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('ReportImageCtrl', ReportImageCtrl);
})();