$app.BuzzDetailCtrl = function($scope, $injector, $q, $translate, $location, $modal, $modalInstance, Session, API, Dialog, buzzId) {
  $injector.invoke($app.BaseModalCtrl, this, {
      $scope: $scope,
      $q: $q,
      API: API
    });
  var token = Session.getAuthority().token;
  var id = buzzId;
  // Type display
  $scope.allowTypeDisplay = 0; // Apply is status(1: image)
  $scope.pathImage = '';
  // Setting info paging
  $scope.setting = {
    numberPagesDisplay : $app.pageDisplay,
    itemsPerPage : $app.pageSize,
    currentPage : 1,
    totalItems : 0
  };
  //Show subcoment
  $scope.subCmtLimit = 4;
  $scope.itemsPerPageSubComment = 10;
  // Buzz detail info
  var reqDataBuzzDetail = {
    api: 'buzz_detail',
    token: token,
    buzz_id: id
  };

  var reqdataComment = {
    api: 'get_comment',
    token: token,
    skip: ($scope.setting.currentPage - 1) * $scope.setting.itemsPerPage,
    take: $scope.setting.itemsPerPage,
    buzz_id: id
  };

  // run more APIs
  var apis = [
    $scope.callAPI(reqDataBuzzDetail),
    $scope.callAPI(reqdataComment)
  ];

  $q.all(apis).then(function(listObject) {
    console.log('===== dl tra về cảu buzz_detail ======');
    console.log(listObject);
    // Buzz detai info
    $scope.buzzDetail = listObject[0];
    var path = $app.imageUrl + '/api=load_img_admin&token=' + token +
      '&img_id=' + listObject[0].buzz_val + '&img_kind=';

    switch (listObject[0].buzz_type) {
      case 1:
  	$scope.allowTypeDisplay = 1;
  	$scope.pathImage = path + 1;
  	break;
        case 2:
  	$scope.allowTypeDisplay = 1;
  	$scope.pathImage = path + 4;
  	break;
    }
    // List comments
    $scope.setting.totalItems = listObject[1].total;
    if (listObject[1].total) {
      $scope.comments = listObject[1].list;
      angular.forEach($scope.comments, function(obj, key){
        obj.currentPageSubCmt = 1;
        obj.viewMoreSubCmt = obj.sub_comment_number > 4 ? true : false;
      });
    }
  }, function(errorCode) {
    Dialog.error(errorCode).then(function() {
      $location.path('/log/buzz');
    });
  });

  // liked list
  $scope.showLikedList = function(buzzId, buzzNum) {
    if (buzzNum === 0)
      return;

    $modal.open({
      templateUrl: 'partials/buzz_liked_list.html',
      controller: LikedListCtrl,
      resolve: {
	services: function() {
	  return {
	    API: API,
	    Dialog: Dialog,
	    $translate: $translate,
	    Session: Session
	  };
	},
	buzzId: function() {
	  return buzzId;
	}
      }
    });
  };

  // load data
  $scope.load = function(page) {
    var reqdataComment = {
      api: 'get_comment',
      token: token,
      skip: (page - 1) * $scope.setting.itemsPerPage,
      take: $scope.setting.itemsPerPage,
      buzz_id: id
    };

    $scope.callAPI(reqdataComment).then(function(res) {
      $scope.setting.totalItems = res.total;

      if (res.total) {
        $scope.comments = res.list;
          angular.forEach($scope.comments, function(obj, key){
          obj.currentPageSubCmt = 1;
          obj.viewMoreSubCmt = obj.sub_comment_number > 4 ? true : false;
      });
      }
    }, function(errorCode) {
      Dialog.error(errorCode);
    });
  };

  // Buzz delete
  $scope.buzzDelete = function(buzzId) {
    Dialog.confirm({
      title: $translate('DIALOG.CONFIRM_TITLE'),
      message: $translate('LOG.BUZZ_DETAIL.CONFIRM_DEL_BUZZ')
    }).then(function(result) {
      if (result) {
      	$scope.callAPI({
      	  api: 'del_buzz_admin',
      	  token: token,
      	  buzz_id: buzzId
      	}).then(function() {
      	  Dialog.alert({
      	    title: $translate('DIALOG.INFO_TITLE'),
      	    message: $translate('LOG.BUZZ_DETAIL.DEL_BUZZ_SUCCESS')
      	  }).then(function() {
      	    //$location.path('/log/buzz');
      	    $scope.close("del");
      	  });
      	}, function(errorCode) {
      	  Dialog.error(errorCode);
      	});
      }
    });
  };

  // Comment delete
  $scope.commentDelete = function(commentId, index) {
    Dialog.confirm({
      title: $translate('DIALOG.CONFIRM_TITLE'),
      message: $translate('LOG.BUZZ_DETAIL.CONFIRM_DEL_COMMENT')
    }).then(function(result) {
      if (result) {
      	var reqDelComment = {
      	  api: 'del_comment_admin',
      	  token: token,
      	  cmt_id: commentId,
      	  buzz_id: id
      	};

      	$scope.callAPI(reqDelComment).then(function() {
      	  Dialog.alert({
      	    title: $translate('DIALOG.INFO_TITLE'),
      	    message: $translate('LOG.BUZZ_DETAIL.DEL_COMMENT_SUCCESS')
      	  }).then(function() {
      	    var offset = $scope.comments.length === 1 ? 1 : 0;
      	    var page = $scope.setting.currentPage - offset;

      	    $scope.setting.currentPage = page < 1 ? 1 : page;

      	    $scope.load($scope.setting.currentPage);
      	  });
      	}, function(errorCode) {
      	  Dialog.error(errorCode);
      	});
      }
    });
  };

  $scope.subCommentDelete = function(commentId, SubCmtIndex, cmtIndex) {
    Dialog.confirm({
      title: $translate('DIALOG.CONFIRM_TITLE'),
      message: $translate('LOG.BUZZ_DETAIL.CONFIRM_DEL_COMMENT')
    }).then(function(result) {
      if (result) {
        var reqDelSubComment = {
          api: 'delete_sub_comment_by_admin',
          token: token,
          sub_comment_id: commentId
        };

        $scope.callAPI(reqDelSubComment).then(function() {
          Dialog.alert({
            title: $translate('DIALOG.INFO_TITLE'),
            message: $translate('LOG.BUZZ_DETAIL.DEL_COMMENT_SUCCESS')
          }).then(function() {
            $scope.comments[cmtIndex].sub_comment.splice(SubCmtIndex, 1);
          });
        }, function(errorCode) {
          Dialog.error(errorCode);
        });
      }
    });
  };

  $scope.viewMore = function(commentId, index) {
    var reqdataSubComment = {
      api: 'get_list_sub_comment_by_admin',
      token: token,
      skip: ($scope.comments[index].currentPageSubCmt -1) * $scope.itemsPerPageSubComment + 4,
      take: $scope.itemsPerPageSubComment + 1,
      cmt_id: commentId
    };
    $scope.callAPI(reqdataSubComment).then(function(res) {
      $scope.comments[index].currentPageSubCmt++;
      $scope.subCmtLimit += $scope.itemsPerPageSubComment;
      angular.forEach(res, function(subCmts, key){
        $scope.comments[index].sub_comment.push(subCmts);
      });
      if(res.length <= 10 ) {
        $scope.comments[index].viewMoreSubCmt = false;
      }

    }, function(errorCode) {
      Dialog.error(errorCode);
    });
  };
   
  $scope.close = function(status) {
    $modalInstance.close(status);
  };
};

var LikedListCtrl = function($scope, $modal, $modalInstance, services, buzzId) {
  //Session.getAuthority().token;
  var token = services.Session.getAuthority().token;
  $scope.attributes = {
    userTypes: $app.labels.get('userTypes')
  };

  var reqDataLikedList = {
    api: 'lst_like',
    token: token,
    buzz_id: buzzId
  };

  services.API.call(reqDataLikedList).then(function(list) {
    $scope.likedList = list;
  }, function(errorCode) {
    services.Dialog.error(errorCode);
  });

  $scope.Ok = function() {
    $modalInstance.close();
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

LikedListCtrl.$inject = ['$scope', '$modal', '$modalInstance', 'services', 'buzzId'];

$app.BuzzDetailCtrl.$inject = ['$scope', '$injector', '$q', '$translate', '$location', '$modal', '$modalInstance', 'Session', 'API', 'Dialog', 'buzzId'];