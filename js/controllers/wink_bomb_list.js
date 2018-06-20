(function() {
  var WinkBombListCtrl = function($scope, $q, $injector, $translate, $modal, Session, API, Dialog, CSV) {
    $injector.invoke($app.BaseModalCtrl, this, {
      $scope: $scope,
      $q: $q,
      API: API
    });
    // String token
    var token = Session.getAuthority().token;
    $scope.input = {};
    $scope.setting = {
      numberPagesDisplay : $app.pageDisplay,
      itemsPerPage : $app.pageSize,
      currentPage : 1,
      totalItems : 0
    };
    $scope.winkMessagesDefault = [
      'LOG.WINK_BOMB_LIST.MESSAGE19',
      'LOG.WINK_BOMB_LIST.MESSAGE20',
      'LOG.WINK_BOMB_LIST.MESSAGE21',
      'LOG.WINK_BOMB_LIST.MESSAGE22',
      'LOG.WINK_BOMB_LIST.MESSAGE23',
      'LOG.WINK_BOMB_LIST.MESSAGE24',
      'LOG.WINK_BOMB_LIST.MESSAGE25',
      'LOG.WINK_BOMB_LIST.MESSAGE26',
      'LOG.WINK_BOMB_LIST.MESSAGE27',
      'LOG.WINK_BOMB_LIST.MESSAGE28',
      'LOG.WINK_BOMB_LIST.MESSAGE29',
      'LOG.WINK_BOMB_LIST.MESSAGE30',
      'LOG.WINK_BOMB_LIST.MESSAGE31',
      'LOG.WINK_BOMB_LIST.MESSAGE32',
      'LOG.WINK_BOMB_LIST.MESSAGE33',
      'LOG.WINK_BOMB_LIST.MESSAGE34',
      'LOG.WINK_BOMB_LIST.MESSAGE35',
      'LOG.WINK_BOMB_LIST.MESSAGE36',
      'LOG.WINK_BOMB_LIST.MESSAGE37'
      
    ];
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true),
      sortBys: [{
          value: 1,
          label: $translate('LOG.WINK_BOMB_LIST.TIME')
        }, {
          value: 2,
          label: $translate('LOG.WINK_BOMB_LIST.POINT_TO_REACH_OUT')
        }, {
          value: 3,
          label: $translate('LOG.WINK_BOMB_LIST.NUMBER_OF_REACH_OUT_PERSON')
        }
      ],
      orderBys: $app.labels.get('orderBys'),
      winkMessages: [{
          value: '',
          label: $translate('FORM.PLEASE_SELECT')
        }
      ]
    };
    
    $scope.getDefaultWinkMessages = function(winkMessagesDefault) {
      var result = [
        {
          value: $translate('LOG.WINK_BOMB_LIST.MESSAGE37'),
          label: $translate('LOG.WINK_BOMB_LIST.MESSAGE37')
        }
      ];
      
      for(var i=0;i<winkMessagesDefault.length;i++) {
        result.push({
          value: $translate(winkMessagesDefault[i]),
          label: $translate(winkMessagesDefault[i])
        });
      }
      return result;
    };
    $scope.attributes.winkMessages = $scope.attributes.winkMessages.concat($scope.getDefaultWinkMessages($scope.winkMessagesDefault));
    $scope.input.userType = $scope.attributes.userTypes[0].value;
    $scope.input.sortBy = $scope.attributes.sortBys[0].value;
    $scope.input.orderBy = $scope.attributes.orderBys[0].value;
    $scope.input.message = $scope.attributes.winkMessages[0].value;
    
    // Search wink bomb
    $scope.searchWinkBomb = function() {
      $scope.setting.totalItems = 0;
      $scope.setting.currentPage = 1;
      $scope.load($scope.setting.currentPage);
    };

    $scope.load = function(page) {
      var reqDataSearch = {
        api : 'search_log_wink_bomb',
        token : token,
        skip : (page - 1) * $scope.setting.itemsPerPage,
        take : $scope.setting.itemsPerPage,
        id : $scope.input.userId,
        user_type : parseIntNullable($scope.input.userType),
        email : ($scope.input.userType === '' ? null : $scope.input.account),
        from_time : new LocalTime($scope.input.fromTime).toString(),
        to_time : new LocalTime($scope.input.toTime).endOfDay().toString(),
        from_point : parseIntNullable($scope.input.from_point),
        to_point : parseIntNullable($scope.input.to_point),
        bomb_num : parseIntNullable($scope.input.bombNum),
        message : $scope.input.message,
        cm_code : $scope.input.cmCode,
        sort : parseIntNullable($scope.input.sortBy),
        order : parseIntNullable($scope.input.orderBy)
      };

      $scope.callAPI(reqDataSearch).then(function(resDataWinkBomb) {
        $scope.setting.totalItems = resDataWinkBomb.total;
        $scope.winkBombList = resDataWinkBomb.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    // Detail wink bomb
    $scope.winkBombDetail = function(item) {
      $modal.open({
        templateUrl : 'partials/wink_bomb_detail.html',
        controller : WinkBombDetailCtrl,
        resolve : {
          services : function() {
            return {
              API : API,
              Dialog : Dialog,
              $translate : $translate,
              Session : Session
            };
          },
          winkBombId : function() {
            return item.id;
          }
        }
      });
    };
    
    $scope.exportCSV = function() {
      var reqDataExportCSV = {
        api : 'search_log_wink_bomb',
        token : token,
        id : $scope.input.userId,
        user_type : parseIntNullable($scope.input.userType),
        email : ($scope.input.userType === '' ? null : $scope.input.account),
        from_time : new LocalTime($scope.input.fromTime).toString(),
        to_time : new LocalTime($scope.input.toTime).endOfDay().toString(),
        from_point : parseIntNullable($scope.input.from_point),
        to_point : parseIntNullable($scope.input.to_point),
        bomb_num : parseIntNullable($scope.input.bombNum),
        message : $scope.input.message,
        cm_code : $scope.input.cmCode,
        sort : parseIntNullable($scope.input.sortBy),
        order : parseIntNullable($scope.input.orderBy),
        csv : $app.timezone
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

// Setting info paging
    
  // Detail wink bomb controller
  var WinkBombDetailCtrl = function($scope, $modalInstance, services, winkBombId) {
    // Session.getAuthority().token;
    var token = services.Session.getAuthority().token;
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes', true)
    };
    var reqData = {
      api : 'detail_wink_bomb',
      token : token,
      id : winkBombId
    };

    services.API.call(reqData).then(function(res) {
      $scope.winkBombDetailInfo = res.list;
    }, function(errorCode) {
      services.Dialog.error(errorCode);
    });

    $scope.Ok = function() {
      $modalInstance.close();
    };
  };
  
  WinkBombDetailCtrl.$inject = ['$scope', '$modalInstance', 'services', 'winkBombId'];
  
  WinkBombListCtrl.$inject = [ '$scope', '$q', '$injector', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('WinkBombListCtrl', WinkBombListCtrl);
})();