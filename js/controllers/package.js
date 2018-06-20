(function() {
  var PackageCtrl = function($scope, $translate, Session, API, Dialog) {
    var token = Session.getAuthority().token;
    $scope.package_apple = {};
    $scope.package_google= {};
    $scope.flag = false;
    var configTypeTab = {
        0 : "apple",
        1 : "google"
    };
    
    $scope.setting = {
      itemsPerPage: $app.pageSize,
      numberPagesDisplay: $app.pageDisplay,
      currentPage: 1
    };
    $scope.setting_apple = {
      totalItems: 0
    };
    
    $scope.setting_google = {
      totalItems: 0
    };
    
    $scope.pageSelect = function(page, type) {
      API.call({
        api: 'lst_point_package',
        type : type, // 0-Apple or 1-Google tab.
        token: token,
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      }).then(function(res) {
        $scope['setting_'+configTypeTab[type]].totalItems = res.length;
        $scope['packages_'+configTypeTab[type]] = res;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.pageSelect($scope.setting.currentPage, 0);
    $scope.pageSelect($scope.setting.currentPage, 1);
    
    // Add
    $scope.add = function(type) {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api: 'irs_point_package',
        type : type,
        token: token,
        production_id: $scope['package_'+configTypeTab[type]].production_id,
        price: $scope['package_'+configTypeTab[type]].price,
        point: $scope['package_'+configTypeTab[type]].point,
        des: $scope['package_'+configTypeTab[type]].des
      }).then(function(res) {

        var newItem = {
          id: res.id,
          production_id: $scope['package_'+configTypeTab[type]].production_id,
          price: $scope['package_'+configTypeTab[type]].price,
          point: $scope['package_'+configTypeTab[type]].point,
          des: $scope['package_'+configTypeTab[type]].des
        };
        $scope['packages_'+configTypeTab[type]].push(newItem);
        $scope['package_'+configTypeTab[type]] = {};
        $scope.flag = false;
      }, function(errorCode) {
        $scope.flag = false;
        errorProcess($translate, Dialog, errorCode);
      });
    };
    
    // Delete
    $scope.delete = function(item, index, type) {
      Dialog.confirm({
        title: $translate('DIALOG.CONFIRM_TITLE'),
        message: $translate('SETTINGS.FREE_PAGE.CONFIRM_DELETE')
      }).then(function(result) {
        if (result) {
          if ($scope.flag) return;
          $scope.flag = true;
          API.call({
            api: 'del_point_package',
            token: token,
            id: item.id
          }).then(function() {
            $scope.flag = false;
            Dialog.alert({
              title: $translate('DIALOG.INFO_TITLE'),
              message: $translate('SETTINGS.FREE_PAGE.MESSAGE_DEL_SUCCESS')
            }).then(function() {
              var offset = $scope['packages_'+configTypeTab[0]].length === 1 ? 1 : 0;
              var package = $scope.setting.currentPage - offset;

              $scope.setting.currentPage = package < 1 ? 1 : package;

              $scope.pageSelect($scope.setting.currentPage,type);

            });
          }, function(errorCode) {
            $scope.flag = false;
            Dialog.error(errorCode);
          });
        }
      });
    };
    
    // update page
    $scope.save = function(item) {
      API.call({
        api: 'upd_point_package',
        token: token,
        id: item.id,
        production_id: item.production_id,
        price: item.price,
        point: item.point,
        des: item.des
      }).then(function() {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.FREE_PAGE.MESSAGE_UPDATE_SUCCESS')
        }).then(function() {
          item.isEdit = false;
        });
      }, function(errorCode) {
        errorProcess($translate, Dialog, errorCode, item);
      });
    };
    
    // Edit
    $scope.edit = function(item) {
      item.isEdit = true;
      item.$clone = angular.copy(item);
    };
    
    // Cancel
    $scope.cancel = function(item) {
      var clone = item.$clone;
      delete item.$clone;
      for ( var key in clone) {
        item[key] = clone[key];
      }
      item.isEdit = false;
    };
  };
  
  var messageDataHandle = {
    4 : {
      control : '#production_id',
      name : 'SETTINGS.PACKAGE.PAGE_TITLE'
    },
    5 : {
      control : '#price',
      name : 'SETTINGS.PACKAGE.PRICE'
    },
    6 : {
      control : '#point',
      name : 'SETTINGS.PACKAGE.POINT'
    },
    7 : {
      control : '#des',
      name : 'SETTINGS.PACKAGE.DES'
    }
    
  };
  
  var errorProcess = function(translate, Dialog, errorCode, item) {
    var data = messageDataHandle[errorCode];
    
    if (isSet(data)) {
      var name = translate(data.name);
      var control = data.control;
      
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate('SETTINGS.FREE_PAGE.FIELD_ERROR', {fieldName: name})
      }).then(function() {
        if (isSet(item) && isSet(item.id)) {
          control += '-' + item.id;
        }
        $(control).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };
  
  PackageCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('PackageCtrl', PackageCtrl);
})();