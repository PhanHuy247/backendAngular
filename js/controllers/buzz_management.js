(function(){
  var BuzzManagementCtrl = function($scope, $translate, Session, API, Dialog){
    var token = Session.getAuthority().token;
    $scope.buzz_management = {};
    // setting info paging
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

    $scope.buzz_management.sortBy = $scope.attributes.sortBys[0].value;
    $scope.buzz_management.isPending = true;
    $scope.buzz_management.orderBy = $scope.attributes.orderBys[0].value;

    $scope.searchBuzz = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.loadBuzzData($scope.setting.currentPage);
    };

    $scope.loadBuzzData = function(page) {
      var reqDataSearchBuzz = {
        api : 'get_reviewing_buzz',
        token : token,
      	id : $scope.buzz_management.id,
      	buzz_id : $scope.buzz_management.buzz_id,
        order : parseIntNullable($scope.buzz_management.orderBy),
        sort : parseIntNullable($scope.buzz_management.sortBy),
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchBuzz).then(function(res) {
        $("html, body").animate({
          scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        $scope.buzzLists = res.list;

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

    $scope.loadBuzzData(1);

    // status: deny || approve
    $scope.changeStatusBuzz = function(status, item) {
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

      var reqChangeStatusBuzz = {
        api : 'review_buzz',
        token : token,
        buzz_id : item.buzz_id,
        type : status
      };

      API.call(reqChangeStatusBuzz).then(function() {
        item.isSuccess = true;
        item.statusLabel = statusName;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
  };

  BuzzManagementCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('BuzzManagementCtrl',BuzzManagementCtrl);
})();
