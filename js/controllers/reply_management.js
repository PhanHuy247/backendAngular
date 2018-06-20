(function(){
  var ReplyManagementCtrl = function($scope, $modal, $translate, Session, API, Dialog){
    var token = Session.getAuthority().token;
    $scope.reply_management = {};

    $scope.setting = {
      numberPagesDisplay : $app.pageDisplay,
      itemsPerPage : $app.pageSize,
      currentPage : 1,
      totalItems : 0
    };
    // built sort filter
    $scope.attributes = {
      sortBys : [ {
        value : 1,
        label : $translate('REPORT.APPROVE_DENY_IMAGE.UPLOAD_TIME')
      }, {
        value : 2,
        label : $translate('REPORT.APPROVE_DENY_IMAGE.REVIEW_TIME')
      } ],
      orderBys: $app.labels.get('orderBys')
    };
    $scope.reply_management.sortBy = $scope.attributes.sortBys[0].value;
    $scope.reply_management.isPending = true;
    $scope.reply_management.orderBy = $scope.attributes.orderBys[0].value;

    $scope.searchComment = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.loadCommentData($scope.setting.currentPage);
    };

    $scope.loadCommentData = function(page) {
      var reqDataSearchComment = {
        api : 'get_reviewing_sub_comment',
        token : token,
        id : $scope.reply_management.id,
        order : parseIntNullable($scope.reply_management.orderBy),
        sort : parseIntNullable($scope.reply_management.sortBy),
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchComment).then(function(res) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        $scope.replyLists = res.list;
        $scope.buttonLeft = 'btn btn-danger';
        $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
        $scope.flagButtonLeft = -1;

        $scope.buttonRight = 'btn btn-primary';
        $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
        $scope.flagButtonRight = 1;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    }
    $scope.loadCommentData(1);
    // status: deny || approve
    $scope.changeStatusComment = function(status, item) {
      var statusName = '';
      switch (status) {
        case 1:
          statusName = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVED');
          item.labelSuccess = true;
          break;
        case -1:
          statusName = $translate('REPORT.APPROVE_DENY_IMAGE.DENIED');
          item.labelImportant = true;
          break;
      }

      var reqChangeStatusComment = {
        api : 'review_sub_comment',
        token : token,
        sub_comment_id : item.sub_comment_id,
        type : status
      };

      API.call(reqChangeStatusComment).then(function() {
        item.isSuccess = true;
        item.statusLabel = statusName;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
  };
  ReplyManagementCtrl.$inject = ['$scope', '$modal', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('ReplyManagementCtrl',ReplyManagementCtrl);
})();
