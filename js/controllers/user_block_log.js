(function() {
  var UserBlockLogCtrl = function($scope, $translate, $modal, API, Session, Dialog, CSV) {
    // string token
    var token = Session.getAuthority().token;
    $scope.user_block = {};

    $scope.setting = {
      numberPagesDisplay : $app.pageDisplay,
      itemsPerPage : $app.pageSize,
      currentPage : 1,
      totalItems : 0
    };

    // Defined the attribute of the controls
    $scope.attributes = {
      userTypes : $app.labels.get('userTypes', true),
      orderBys : $app.labels.get('orderBys'),
      types : [ {
        value : 0,
        label : $translate('LOG.USER_BLOCK_LOG.UNBLOCK')
      }, {
        value : 1,
        label : $translate('LOG.USER_BLOCK_LOG.BLOCK')
      } ]
    };
    // set default user type: request, partner
    $scope.user_block.reqUserType = $scope.attributes.userTypes[0].value;
    $scope.user_block.partnerUserType = $scope.attributes.userTypes[0].value;

    // set default order by, sort by
    $scope.user_block.orderBy = $scope.attributes.orderBys[0].value;
    $scope.user_block.sortBy = 1;

    // Search user block
    $scope.searchUserBlockLog = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      var reqDataSearchUserBlock = {
        api : 'search_log_blk',
        token : token,
        // requset
        req_id : $scope.user_block.reqUserId,
        req_user_type : parseIntNullable($scope.user_block.reqUserType),
        req_email : ($scope.user_block.reqUserType === '' ? null : $scope.user_block.reqAccount),
        req_cm_code : $scope.user_block.reqCmCode,
        // partner
        partner_id : $scope.user_block.partnerUserId,
        partner_user_type : parseIntNullable($scope.user_block.partnerUserType),
        partner_email : ($scope.user_block.partnerUserType === '' ? null : $scope.user_block.partnerAccount),
        partner_cm_code : $scope.user_block.partnerCmCode,

        from_time : new LocalTime($scope.user_block.fromTime).toString(),
        to_time : new LocalTime($scope.user_block.toTime).endOfDay().toString(),
        sort : parseIntNullable($scope.user_block.sortBy),
        order : parseIntNullable($scope.user_block.orderBy),
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage
      };

      API.call(reqDataSearchUserBlock).then(function(res) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        $scope.userBlockLogList = res.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.exportCSV = function() {
      var reqDataSearchUserBlock = {
        api : 'search_log_blk',
        token : token,
        // requset
        req_id : $scope.user_block.reqUserId,
        req_user_type : parseIntNullable($scope.user_block.reqUserType),
        req_email : ($scope.user_block.reqUserType === '' ? null : $scope.user_block.reqAccount),
        req_cm_code : $scope.user_block.reqCmCode,
        // partner
        partner_id : $scope.user_block.partnerUserId,
        partner_user_type : parseIntNullable($scope.user_block.partnerUserType),
        partner_email : ($scope.user_block.partnerUserType === '' ? null : $scope.user_block.partnerAccount),
        partner_cm_code : $scope.user_block.partnerCmCode,
        from_time : new LocalTime($scope.user_block.fromTime).toString(),
        to_time : new LocalTime($scope.user_block.toTime).endOfDay().toString(),
        sort : parseIntNullable($scope.user_block.sortBy),
        order : parseIntNullable($scope.user_block.orderBy),
        csv : $app.timezone
      };

      CSV.get(reqDataSearchUserBlock).then(function(res) {
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    /*$scope.userDetail = function(userId) {
      $modal.open({
        templateUrl: 'partials/common/dialog_user_detail.html',
        controller: $app.UserDetailCtrl,
        windowClass: 'user-detail-modal',
        resolve: {
          userId: function() {
            return userId;
          }
        }
      });
    };*/
  };

  UserBlockLogCtrl.$inject = [ '$scope', '$translate', '$modal', 'API', 'Session', 'Dialog', 'CSV' ];
  $app.controllers.controller('UserBlockLogCtrl', UserBlockLogCtrl);
})();