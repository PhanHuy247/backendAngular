(function () {
  var UserFriendFavoriteCtrl = function($scope,$q, $injector, $translate, $modal, Session, API, Dialog) {
    $injector.invoke($app.BaseModalCtrl, this, {
      $scope: $scope,
      $q: $q,
      API: API
    });
    var token = Session.getAuthority().token;
    $scope.user_fff = {};
    // Setting info paging
    $scope.setting = {
      numberPagesDisplay: $app.pageDisplay,
      itemsPerPage: $app.pageSize,
      currentPage: 1,
      totalItems: 0
    };
    // built attribute for control
    $scope.attributes = {
      userTypes : $app.labels.get('userTypes', true),
      sortBys : [
        {value : 1, label : $translate('USER.INFO.USER_NAME')},
        {value : 2, label : $translate('USER.FRIEND_FAVORITES_FAVORITED.SORT_BY.FRIEND_NUMBER')},
        {value : 3, label : $translate('USER.FRIEND_FAVORITES_FAVORITED.SORT_BY.FAVORITES_NUMBER')},
        {value : 4, label : $translate('USER.FRIEND_FAVORITES_FAVORITED.SORT_BY.FAVORITED_NUMBER')}
      ],
      orderBys : $app.labels.get('orderBys')
    };
    
    // set default attribute
    $scope.user_fff.userType = $scope.attributes.userTypes[0].value;
    $scope.user_fff.sortBy = $scope.attributes.sortBys[0].value;
    $scope.user_fff.orderBy = $scope.attributes.orderBys[0].value;
    
    // Search
    $scope.searchUserFriendFavorite = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };
    
    $scope.load = function (page) {
      var reqDataSearch = {
        api: 'search_con',
        token: token,
        id: $scope.user_fff.userId,
        user_type: parseIntNullable($scope.user_fff.userType),
        user_name: $scope.user_fff.userName,
        email: ($scope.user_fff.userType === '' ? null : $scope.user_fff.account),
        cm_code: $scope.user_fff.cmCode,
        from_frd: parseIntNullable($scope.user_fff.friendFrom),
        to_frd: parseIntNullable($scope.user_fff.friendTo),
        from_fav: parseIntNullable($scope.user_fff.favoritesFrom),
        to_fav: parseIntNullable($scope.user_fff.favoritesTo),
        from_fvt: parseIntNullable($scope.user_fff.favoritedFrom),
        to_fvt: parseIntNullable($scope.user_fff.favoritedTo),
        sort: parseIntNullable($scope.user_fff.sortBy),
        order: parseIntNullable($scope.user_fff.orderBy),
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      };
      
      $scope.callAPI(reqDataSearch).then(function(res) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        
        $scope.friendFavoriteList = res.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
    
    // Detail info: Friends, Favorites, Favorited
    $scope.infoDialog = function(item, type) {
      $modal.open({
        templateUrl : 'partials/user_friend_favorite_dialog.html',
        controller : InfoDialogCtrl,
        resolve : {
          services : function() {
            return {
              API : API,
              Dialog : Dialog,
              $translate : $translate,
              Session : Session
            };
          },
          item : function() {
            return item;
          },
          type: function() {
            return type;
          }
        }
      });
    };
    
    // User detail
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
  
  var InfoDialogCtrl = function($scope, $modal, $modalInstance, services, item, type) {
    var token = services.Session.getAuthority().token;
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes')
    };
    var nameDialog = services.$translate('DIALOG.ERROR_TITLE');
    switch (type) {
      case 1:
        nameDialog = services.$translate('USER.FRIEND_FAVORITES_FAVORITED.FRIENDS');
        break;
      case 2:
        nameDialog = services.$translate('USER.FRIEND_FAVORITES_FAVORITED.FAVORITES');
        break;
      case 3:
        nameDialog = services.$translate('USER.FRIEND_FAVORITES_FAVORITED.FAVORITED');
        break;
    }
    
    $scope.title = services.$translate('USER.FRIEND_FAVORITES_FAVORITED.FRIEND_FAVORITE_LIST_TITLE', {nameDialog: nameDialog});
    $scope.item = item;
    
    var reqData = {
      api: 'lst_con',
      token: token,
      id: item.user_id,
      type: parseIntNullable(type)
    };
    
    services.API.call(reqData).then(function(res) {
      $scope.friendFavoriteDetailList = res.list;
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
  
  InfoDialogCtrl.$inject = ['$scope', '$modal', '$modalInstance', 'services', 'item', 'type'];
  
  UserFriendFavoriteCtrl.$inject = ['$scope', '$q', '$injector', '$translate', '$modal', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('UserFriendFavoriteCtrl', UserFriendFavoriteCtrl);
}) ();