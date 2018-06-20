(function() {
  var NotificationLogCtrl = function($scope, $translate, $sce, $modal, Session, API, Dialog, CSV) {
    var token = Session.getAuthority().token;
    var name = $translate('LOG.NOTIFICATION.XXX');
    $scope.notification = {};

    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };

    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      orderBys: $app.labels.get('orderBys'),
      noTypes: $app.labels.get('noTypes', true),
      sortBys: [{
          value: 1,
          label: $translate('LOG.NOTIFICATION.TIME')
        }
      ]
    };
    $scope.notification.userType = $scope.attributes.userTypes[0].value;
    $scope.notification.type = $scope.attributes.noTypes[0].value;
    $scope.notification.orderBy = $scope.attributes.orderBys[0].value;
    $scope.notification.sortBy = $scope.attributes.sortBys[0].value;

    $scope.searchNotificationLog = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      if ($scope.notification.userType === $scope.attributes.userTypes[0].value) {
        $scope.notification.account = null;
      }

      var reqDataSearchNotification = {
        api: 'search_log_noti',
        token: token,
        id: $scope.notification.userId,
        user_type: parseIntNullable($scope.notification.userType),
        email: $scope.notification.account,
        from_time: new LocalTime($scope.notification.fromTime).toString(),
        to_time: new LocalTime($scope.notification.toTime).endOfDay().toString(),
        cm_code: $scope.notification.cmCode,
        type: parseIntNullable($scope.notification.type),
        sort: parseIntNullable($scope.notification.sortBy),
        order: parseIntNullable($scope.notification.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchNotification).then(function(res) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;

        for (var i in res.list) {
          res.list[i].isSetPartnerName = false;
          var html = '<a class="btn-link" href="#/user/user_detail/' + res.list[i].partner_id + '" target="_blank">' + res.list[i].partner_id + '</a>';

          switch (res.list[i].type) {
            case 4:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_FAVORITE', {name: html}));
              break;
            case 5:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_LIKED', {name: html}));
              break;
            case 6:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_ALSO_LIKED', {name: html}));
              break;
            case 7:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_RESPONSED_YOUR_BUZZ', {name: html}));
              break;
            case 8:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_RESPONSED_THE_BUZZ', {name: html}));
              break;
            case 9:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_UNLOCKED_YOUR_BACKSTAGE', {name: html}));
              break;
            case 10:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_BECAME_YOUR_FRIEND', {name: html}));
              break;
            case 11:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_CHAT_WITH_YOU', {name: html}));
              break;
            case 12:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_BECAME_ONLINE', {name: html}));
              break;
            case 19:
              res.list[i].isSetPartnerName = true;
              res.list[i].type = $sce.trustAsHtml($translate('LOG.NOTIFICATION.XXX_POST_NEW_BUZZ', {name: html}));
              break;
          }
        }

        $scope.notifications = res.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.exportCSV = function() {
      if ($scope.notification.userType === $scope.attributes.userTypes[0].value) {
        $scope.notification.account = null;
      }

      var reqDataExportCSV = {
        api: 'search_log_noti',
        token: token,
        id: $scope.notification.userId,
        user_type: parseIntNullable($scope.notification.userType),
        email: $scope.notification.account,
        from_time: new LocalTime($scope.notification.fromTime).toString(),
        to_time: new LocalTime($scope.notification.toTime).endOfDay().toString(),
        cm_code: $scope.notification.cmCode,
        type: parseIntNullable($scope.notification.type),
        sort: parseIntNullable($scope.notification.sortBy),
        order: parseIntNullable($scope.notification.orderBy),
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

  NotificationLogCtrl.$inject = ['$scope', '$translate', '$sce', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('NotificationLogCtrl', NotificationLogCtrl);
})();
