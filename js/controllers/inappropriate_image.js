(function() {
  var InappropriateImageCtrl = function($scope, $translate, $modal, API, Session, Dialog) {
    
    var token = Session.getAuthority().token;
    // Setting info paging
    $scope.setting = {
      numberPagesDisplay : $app.pageDisplay,
      itemsPerPage : $app.pageSize,
      currentPage : 1,
      totalItems : 0
    };
    // built an array filter image status, sort
    $scope.attributes = {
      filters : [ {
        value : 0,
        label : $translate('REPORT.INAPPROPRIATE_IMAGE.WAITING')
      }, {
        value : 1,
        label : $translate('REPORT.INAPPROPRIATE_IMAGE.GOOD')
      }, {
        value : -1,
        label : $translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD')
      } ],
      sortBys : [ {
        value : 1,
        label : $translate('REPORT.INAPPROPRIATE_IMAGE.REPORT_TIME')
      }, {
        value : 2,
        label : $translate('REPORT.INAPPROPRIATE_IMAGE.REPORT_NUMBER')
      } ],
      imageTypes : $app.labels.get('imageTypes'),
      orderBys: $app.labels.get('orderBys')
    };
    $scope.approve_deny = {
      filterBy : $scope.attributes.filters[0].value,
      sortBy : $scope.attributes.sortBys[0].value,
      isPending : true,
      orderBy : $scope.attributes.orderBys[0].value
    };

    // change control sort by status when user change option list by image
    $scope.changeStatusControl = function(flag) {
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

    // search image
    $scope.searchImageApproveDeny = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      var reqDataSearchImageApproveDeny = {
        api : 'lst_rpt_image',
        token : token,
        type : parseIntNullable($scope.approve_deny.filterBy),
        order : parseIntNullable($scope.approve_deny.orderBy),
        sort : parseIntNullable($scope.approve_deny.sortBy),
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchImageApproveDeny).then(function(res) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        
        for (var i in res.list) {
          res.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
            + '&img_id=' + res.list[i].img_id + '&img_kind=2';
        }
        
        $scope.listImages = res.list;

        switch ($scope.approve_deny.filterBy) {
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
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    // default load image approve
    $scope.load(1);

    // status: not_good || good || waiting
    $scope.changeStatusImage = function(status, image) {
      var statusName = '';
      switch (status) {
        case 0:
          statusName = $translate('REPORT.INAPPROPRIATE_IMAGE.WAITING');
          break;
        case 1:
          statusName = $translate('REPORT.INAPPROPRIATE_IMAGE.GOOD');
          image.labelSuccess = true;
          break;
        case -1:
          statusName = $translate('REPORT.INAPPROPRIATE_IMAGE.NOT_GOOD');
          image.labelImportant = true;
          break;
      }
      
      var reqChangeStatusImage = {
        api : 'process_rpt_image',
        token : token,
        img_id : image.img_id,
        type : status
      };

      API.call(reqChangeStatusImage).then(function() {
        image.isSuccess = true;
        image.statusLabel = statusName;
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

  InappropriateImageCtrl.$inject = [ '$scope', '$translate', '$modal', 'API', 'Session', 'Dialog' ];
  $app.controllers.controller('InappropriateImageCtrl', InappropriateImageCtrl);
})();