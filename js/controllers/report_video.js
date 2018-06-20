(function () {
  var ReportVideoCtrl = function ($scope, $modal, Session, API, Dialog, CSV) {
    // string token
    var token = Session.getAuthority().token;
    $scope.report_video = {};
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
      videoTypes: $app.labels.get('videoTypes', true),//loại video
      reportTypes: $app.labels.get('reportTypes', true),//loại báo cáo
      orderBys: $app.labels.get('orderBys')
    };

    $scope.report_video = {
      reqUserType: $scope.attributes.userTypes[0].value,
      partnerUserType: $scope.attributes.userTypes[0].value,
      type: $scope.attributes.videoTypes[0].value,
      reportType: $scope.attributes.reportTypes[0].value,
      sortBy: 1,
      orderBy: $scope.attributes.orderBys[0].value,
    };

    // Search report image
    $scope.searchReportVideo = function () {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function (page) {
      if ($scope.report_video.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_video.reqAccount = null;
      }

      if ($scope.report_video.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_video.partnerAccount = null;
      }

      var reqDataSearchVideo = {
        api: 'search_rpt_video',
        token: token,
        req_id: $scope.report_video.reqUserId,
        req_user_type: parseIntNullable($scope.report_video.reqUserType),
        req_email: $scope.report_video.reqAccount,
        req_cm_code: $scope.report_video.reqCmCode,
        partner_id: $scope.report_video.partnerUserId,
        partner_user_type: parseIntNullable($scope.report_video.partnerUserType),
        partner_email: $scope.report_video.partnerAccount,
        partner_cm_code: $scope.report_video.partnerCmCode,
        from_time: new LocalTime($scope.report_video.fromTime).toString(),
        to_time: new LocalTime($scope.report_video.toTime).endOfDay().toString(),
        file_id: $scope.report_video.id,
        // img_type: parseIntNullable($scope.report_video.type),
        rpt_type: parseIntNullable($scope.report_video.reportType),// loại báo cáo
        privacy: parseIntNullable($scope.report_video.type),//loại video 
        sort: parseIntNullable($scope.report_video.sortBy),
        order: parseIntNullable($scope.report_video.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchVideo).then(function (image) {
        $("html, body").animate({
          scrollTop: $("#block-center-screen").position().top
        }, 1000);
        for (var i = 0; i < image.list.length; i++) {
          image.list[i].$checkImageStatus = function () {
            return API.call({
              api: 'get_img_inf',
              token: token,
              img_id: this.img_id
            }).then(function (response) {
              return response.img_stt;
            }, function (errorCode) {
              Dialog.error(errorCode);
            });
          };

          image.list[i].$reviewImage = function () {
            var deniedStatus = -1;
            var reqChangeStatusImage = {
              api: 'review_video',
              token: token,
              img_id: this.img_id,
              type: deniedStatus
            };

            return API.call(reqChangeStatusImage).then(function () {}, function (errorCode) {
              Dialog.error(errorCode);
            });
          };

          /*image.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token +
            '&img_id=' + image.list[i].img_id + '&img_kind=2';*/
        }

        $scope.setting.totalItems = image.total;
        $scope.videoList = image.list;
      }, function (errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.exportCSV = function () {
      if ($scope.flag) return;
      if ($scope.report_video.reqUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_video.reqAccount = null;
      }
      if ($scope.report_video.partnerUserType === $scope.attributes.userTypes[0].value) {
        $scope.report_video.partnerAccount = null;
      }
      $scope.flag = true;
      var reqDataExportCSV = {
        api: 'search_rpt_video',
        token: token,
        req_id: $scope.report_video.reqUserId,
        req_user_type: parseIntNullable($scope.report_video.reqUserType),
        req_email: $scope.report_video.reqAccount,
        req_cm_code: $scope.report_video.reqCmCode,
        partner_id: $scope.report_video.partnerUserId,
        partner_user_type: parseIntNullable($scope.report_video.partnerUserType),
        partner_email: $scope.report_video.partnerAccount,
        partner_cm_code: $scope.report_video.partnerCmCode,
        from_time: new LocalTime($scope.report_video.fromTime).toString(),
        to_time: new LocalTime($scope.report_video.toTime).endOfDay().toString(),
        img_id: $scope.report_video.id,
        img_type: parseIntNullable($scope.report_video.type),
        rpt_type: parseIntNullable($scope.report_video.reportType),
        sort: parseIntNullable($scope.report_video.sortBy),
        order: parseIntNullable($scope.report_video.orderBy),
        csv: $app.timezone
      };

      CSV.get(reqDataExportCSV).then(function () {
        $scope.flag = false;
      }, function (errorCode) {
        $scope.flag = false;
        Dialog.error(errorCode);
      });
    };

  };

  ReportVideoCtrl.$inject = ['$scope', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('ReportVideoCtrl', ReportVideoCtrl);
})();