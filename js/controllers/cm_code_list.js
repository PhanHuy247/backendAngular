(function () {
  var CmCodeListCtrl = function ($scope, $translate, Session, API, Dialog) {

    // String token
    var token = Session.getAuthority().token;
    // Setting info paging
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };

    $scope.attributes = {
      status: $app.labels.get('status', true),
      trackUrl: $app.labels.get('trackUrl', true)
    };

    $scope.input = {
      status: $scope.attributes.status[0].value,
      type: $scope.attributes.trackUrl[0].value
    };

    // Load affiliate and media
    API.call({
      api: 'init_reg_cm_code',
      token: token
    }).then(function (res) {
      $scope.affiliateList = res;
      $scope.changeAff();
    }, function (errorCode) {
      Dialog.error(errorCode);
    });

    // Change affiliate
    $scope.changeAff = function () {
      if ($scope.input.affId === null) {
        $scope.mediaList = [];
      } else {
        for (var i = 0; i < $scope.affiliateList.length; i++) {
          if ($scope.affiliateList[i].aff_id === $scope.input.affId) {
            $scope.mediaList = $scope.affiliateList[i].media_lst;
          }
        }
      }

    };

    // search CM code
    $scope.searchCmCode = function () {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function (page) {
      // Request data
      var reqDataSearchCmCode = {
        api: 'lst_cm_code',
        token: token,
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage,
        aff_id: $scope.input.affId,
        media_id: $scope.input.mediaId,
        cm_code: $scope.input.cmCode,
        flag: parseIntNullable($scope.input.status),
        type: parseIntNullable($scope.input.type)
      };

      // call API
      API.call(reqDataSearchCmCode).then(function (res) {
        console.log('====== dl trả về của list_cm_code =======');
        console.log(res);
        $("html, body").animate({
          scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total_record;
        $scope.listCmCode = res.cm_code_lst;
      }, function (errorCode) {
        Dialog.error(errorCode);
      });
    };
  };

  CmCodeListCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('CmCodeListCtrl', CmCodeListCtrl);
})();