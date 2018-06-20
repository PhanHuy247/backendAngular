(function(){
  var CommentManagementCtrl = function($scope, $modal, $translate, Session, API, Dialog){
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
    $scope.comment_management = {
      sortBy : $scope.attributes.sortBys[0].value,
      isPending : true,
      orderBy : $scope.attributes.orderBys[0].value
    };

    $scope.searchComment = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.loadCommentData($scope.setting.currentPage);
    };

    $scope.loadCommentData = function(page) {
      var reqDataSearchComment = {
        api : 'get_reviewing_comment',
        token : token,
        id : $scope.comment_management.id,
        order : parseIntNullable($scope.comment_management.orderBy),
        sort : parseIntNullable($scope.comment_management.sortBy),
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchComment).then(function(res) {
        console.log('==== dl trả về của comment management ========');
        console.log(res);
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
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
        //console.log(res[0]['replaced_string']);
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

 /* var ViewingSubComment = function($scope, $modalInstance, $translate, API, Session, Dialog, commentID) {
    var token = Session.getAuthority().token;
    var reqDataSubComment = {
      api : 'get_reviewing_sub_comment',
      token : token,
      comment_id : commentID
    };
    API.call(reqDataSubComment).then(function(res) {
      $scope.comment = res;

      $scope.subCommentLists = res.sub_comment;

      $scope.buttonLeft = 'btn btn-danger';
      $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
      $scope.flagButtonLeft = -1;

      $scope.buttonRight = 'btn btn-primary';
      $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
      $scope.flagButtonRight = 1;
    }, function(errorCode) {
      Dialog.error(errorCode);
    });

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

    $scope.close = function() {
      $modalInstance.close();
    };
  };

  ViewingSubComment.$inject = ['$scope','$modalInstance', '$translate', 'API', 'Session', 'Dialog', 'commentID'];*/

  CommentManagementCtrl.$inject = ['$scope', '$modal', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('CommentManagementCtrl',CommentManagementCtrl);
})();
