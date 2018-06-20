(function () {
  var InappropriateVideoCtrl = function ($scope, $translate, $modal, API, Session, Dialog) {
    var token = Session.getAuthority().token;
    // Setting info paging
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };
    // built an array filter video status, sort
    $scope.attributes = {
      videoStatus: $app.labels.get('videoStatus'), // trạng thái video: pending,OK,NG
      videoTypes: $app.labels.get('videoTypes'), // Loại video: công khai, bí mật
      sortBys: $app.labels.get('sortBys'),
      orderBys: $app.labels.get('orderBys')
    };
    $scope.approve_deny = {
      videoStatus: $scope.attributes.videoStatus[0].value,
      sortBy: $scope.attributes.sortBys[0].value,
      orderBy: $scope.attributes.orderBys[0].value,
      isPending: true,
    };

    // change control sort by status when user change option list by video
    $scope.changeStatusControl = function (flag) {
      switch (flag) {
        case 0:
          $scope.approve_deny.sortBy = $scope.attributes.sortBys[0].value;
          $scope.approve_deny.isPending = true;
          break;
        default:
          $scope.approve_deny.isPending = false;
          break;
      }
    };

    // search video
    $scope.searchVideoApproveDeny = function () {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function (page) {
      var reqDataSearchVideoApproveDeny = {
        api: 'lst_rpt_video',
        token: token,
        type: parseIntNullable($scope.approve_deny.videoStatus),
        order: parseIntNullable($scope.approve_deny.orderBy),
        sort: parseIntNullable($scope.approve_deny.sortBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchVideoApproveDeny).then(function (res) {
        $("html, body").animate({
          scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        $scope.listVideos = res.list;

        switch ($scope.approve_deny.videoStatus) {
          case 0:
            $scope.title = $translate('REPORT.INAPPROPRIATE_IMAGE.WAITING');
            // set info button: not_good, good
            $scope.buttonLeft = 'btn btn-danger';
            $scope.labelButtonLeft = $translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD');
            $scope.flagButtonLeft = -1;

            $scope.buttonRight = 'btn btn-primary';
            $scope.labelButtonRight = $translate('REPORT.INAPPROPRIATE_IMAGE.GOOD');
            $scope.flagButtonRight = 1;
            break;
          case 1:
            $scope.title = $translate('REPORT.INAPPROPRIATE_IMAGE.GOOD');
            // Button: not_good, waiting
            $scope.buttonLeft = 'btn btn-danger';
            $scope.labelButtonLeft = $translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD');
            $scope.flagButtonLeft = -1;

            $scope.buttonRight = 'btn';
            $scope.labelButtonRight = $translate('REPORT.INAPPROPRIATE_IMAGE.WAITING');
            $scope.flagButtonRight = 0;
            break;
          case -1:
            $scope.title = $translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD');
            // Button: good, waiting
            $scope.buttonLeft = 'btn btn-primary';
            $scope.labelButtonLeft = $translate('REPORT.INAPPROPRIATE_IMAGE.GOOD');
            $scope.flagButtonLeft = 1;

            $scope.buttonRight = 'btn';
            $scope.labelButtonRight = $translate('REPORT.INAPPROPRIATE_IMAGE.WAITING');
            $scope.flagButtonRight = 0;
            break;
        }
      }, function (errorCode) {
        Dialog.error(errorCode);
      });
    };

    // default load video approve
    $scope.load(1);

    // status: not_good || good || waiting
    $scope.changeStatusVideo = function (status, video) {
      console.log('======video =====');
      console.log(video);
      var statusName = '';
      switch (status) {
        case 0:
          statusName = $translate('REPORT.INAPPROPRIATE_IMAGE.WAITING');
          break;
        case 1:
          statusName = $translate('REPORT.INAPPROPRIATE_IMAGE.GOOD');
          video.labelSuccess = true;
          break;
        case -1:
          statusName = $translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD');
          video.labelImportant = true;
          break;
      }

      var reqChangeStatusVideo = {
        api: 'process_rpt_video',
        token: token,
        video_id: video.video_id,
        type: status,
        file_type: video.file_type
      };

      API.call(reqChangeStatusVideo).then(function () {
        video.isSuccess = true;
        video.statusLabel = statusName;
      }, function (errorCode) {
        Dialog.error(errorCode);
      });
    };
  };

  InappropriateVideoCtrl.$inject = ['$scope', '$translate', '$modal', 'API', 'Session', 'Dialog'];
  $app.controllers.controller('InappropriateVideoCtrl', InappropriateVideoCtrl);
})();