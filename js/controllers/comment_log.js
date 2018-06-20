(function(){
  var CommentLogCtrl = function($scope, $modal, $translate, Session, API, Dialog){
    var token = Session.getAuthority().token;
    

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

    $scope.comment_log = {
      sortBy : $scope.attributes.sortBys[0].value,
      isPending : true,
      orderBy : $scope.attributes.orderBys[0].value,
    };

    $scope.searchComment = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.loadCommentData($scope.setting.currentPage);
    };
    console.log($scope.comment_log);
    $scope.loadCommentData = function(page) {
      var reqDataSearchComment = {
        api : 'get_reviewing_comment',
        token : token,
        id : $scope.comment_log.id,
        order : parseIntNullable($scope.comment_log.orderBy),
        sort : parseIntNullable($scope.comment_log.sortBy),
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage,
        from_time: new LocalTime($scope.comment_log.fromTime).toString(),
        to_time: new LocalTime($scope.comment_log.toTime).endOfDay().toString(),
      };

      API.call(reqDataSearchComment).then(function(res) {
        console.log(res);
        $scope.setting.totalItems = res.total;
        $scope.commentLists = res.list;

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
        api : 'review_comment',
        token : token,
        comment_id : item.comment_id,
        type : status
      };

      API.call(reqChangeStatusComment).then(function(res) {
        item.isSuccess = true;
        item.statusLabel = statusName;
        item.comment_value = res[0]['replaced_string'];
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.subCommentDetail = function(commentID) {
      var modalInstance = $modal.open({
        templateUrl : 'partials/viewing_sub_comment.html',
        controller : ViewingSubComment,
        windowClass : 'user-detail-modal',
        resolve : {
          commentID : function() {
            return commentID;
          }
        }
      });
    };
  };

  CommentLogCtrl.$inject = ['$scope', '$modal', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('CommentLogCtrl',CommentLogCtrl);
})();
