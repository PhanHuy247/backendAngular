(function() {
  var FavoritesLogCtrl = function($scope, $translate, $modal, Session, API, Dialog, CSV) {
    var token = Session.getAuthority().token;
    
    
    $scope.setting = {
      numberPagesDisplay : $app.pageDisplay,
      itemsPerPage : $app.pageSize,
      currentPage : 1,
      totalItems : 0
    };
    
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      orderBys: $app.labels.get('orderBys'),
      favorites: [{
          value: 0,
          label: $translate('LOG.FAVORITES.UNFAVORITE')
        }, {
          value: 1,
          label: $translate('LOG.FAVORITES.FAVORITE')
        }
      ]
    };
    $scope.favorite = {
      // Set default for request user type and partner user type
      reqUserType : $scope.attributes.userTypes[0].value,
      partnerUserType : $scope.attributes.userTypes[0].value,
      // Set default for sort, order
      sortBy : 1,
      orderBy : $scope.attributes.orderBys[0].value
    };
    

    // Search online alert
    $scope.searchFavoritesLog = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    //  create load data
    $scope.load = function(page) {
      var reqDataSearchFavorites = {
        api: 'search_log_fav',
        token: token,
        // requset
        req_id: $scope.favorite.reqUserId,
        req_user_type: parseIntNullable($scope.favorite.reqUserType),
        req_email: ($scope.favorite.reqUserType === '' ? null : $scope.favorite.reqAccount),
        req_cm_code: $scope.favorite.reqCmCode,
        // partner
        partner_id: $scope.favorite.partnerUserId,
        partner_user_type: parseIntNullable($scope.favorite.partnerUserType),
        partner_email: ($scope.favorite.partnerUserType === '' ? null : $scope.favorite.partnerAccount),
        partner_cm_code: $scope.favorite.partnerCmCode,

        from_time: new LocalTime($scope.favorite.fromTime).toString(),
        to_time: new LocalTime($scope.favorite.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.favorite.sortBy),
        order: parseIntNullable($scope.favorite.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };
      
      API.call(reqDataSearchFavorites).then(function(data) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = data.total;
        $scope.data = data.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    $scope.exportCSV = function() {
      var reqDataExportCSV = {
        api: 'search_log_fav',
        token: token,
        // requset
        req_id: $scope.favorite.reqUserId,
        req_user_type: parseIntNullable($scope.favorite.reqUserType),
        req_email: ($scope.favorite.reqUserType === '' ? null : $scope.favorite.reqAccount),
        req_cm_code: $scope.favorite.reqCmCode,
        // partner
        partner_id: $scope.favorite.partnerUserId,
        partner_user_type: parseIntNullable($scope.favorite.partnerUserType),
        partner_email: ($scope.favorite.partnerUserType === '' ? null : $scope.favorite.partnerAccount),
        partner_cm_code: $scope.favorite.partnerCmCode,

        from_time: new LocalTime($scope.favorite.fromTime).toString(),
        to_time: new LocalTime($scope.favorite.toTime).endOfDay().toString(),
        sort: parseIntNullable($scope.favorite.sortBy),
        order: parseIntNullable($scope.favorite.orderBy),
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
  
  FavoritesLogCtrl.$inject = ['$scope', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('FavoritesLogCtrl', FavoritesLogCtrl);
})();