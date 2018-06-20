(function() {
  var FreePageCtrl = function($scope, $translate, Session, API, Dialog) {
    var token = Session.getAuthority().token;
    $scope.page = {};
    $scope.flag = false;
    
    $scope.setting = {
      itemsPerPage: $app.pageSize,
      numberPagesDisplay: $app.pageDisplay,
      totalItems: 0,
      currentPage: 1
    };
    
    $scope.pageSelect = function(page) {
      API.call({
        api: 'lst_ext_page',
        token: token,
        skip: (page - 1) * $scope.setting.itemsPerPage,
        take: $scope.setting.itemsPerPage
      }).then(function(res) {
        $scope.setting.totalItems = res.total;
        $scope.freePages = res.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.pageSelect($scope.setting.currentPage);
    
    // Add
    $scope.pageAdd = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api: 'irs_ext_page',
        token: token,
        title: $scope.page.title,
        url: $scope.page.url
      }).then(function(res) {
        $scope.setting.totalItems++;
        if (parseInt($scope.freePages.length) < parseInt($scope.setting.itemsPerPage)) {
          var newItem = {
            id: res.id,
            title: $scope.page.title,
            url: $scope.page.url
          };

          $scope.freePages.push(newItem);
        }
        $scope.page = {};
        $scope.flag = false;
      }, function(errorCode) {
        $scope.flag = false;
        errorProcess($translate, Dialog, errorCode);
      });
    };
    
    // Delete
    $scope.pageDelete = function(item, index) {
      Dialog.confirm({
        title: $translate('DIALOG.CONFIRM_TITLE'),
        message: $translate('SETTINGS.FREE_PAGE.CONFIRM_DELETE')
      }).then(function(result) {
        if (result) {
          if ($scope.flag) return;
          $scope.flag = true;
          API.call({
            api: 'del_ext_page',
            token: token,
            id: item.id
          }).then(function() {
            $scope.flag = false;
            Dialog.alert({
              title: $translate('DIALOG.INFO_TITLE'),
              message: $translate('SETTINGS.FREE_PAGE.MESSAGE_DEL_SUCCESS')
            }).then(function() {
              var offset = $scope.freePages.length === 1 ? 1 : 0;
              var page = $scope.setting.currentPage - offset;

              $scope.setting.currentPage = page < 1 ? 1 : page;

              $scope.pageSelect($scope.setting.currentPage);
            });
          }, function(errorCode) {
            $scope.flag = false;
            Dialog.error(errorCode);
          });
        }
      });
    };
    
    // update page
    $scope.pageSave = function(item) {
      API.call({
        api: 'upd_ext_page',
        token: token,
        id: item.id,
        title: item.title,
        url: item.url
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
    $scope.pageEdit = function(item) {
      item.isEdit = true;
      item.$clone = angular.copy(item);
    };
    
    // Cancel
    $scope.pageCancel = function(item) {
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
      control : '#title',
      name : 'SETTINGS.FREE_PAGE.PAGE_TITLE'
    },
    5 : {
      control : '#url',
      name : 'SETTINGS.FREE_PAGE.URL'
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
  
  FreePageCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('FreePageCtrl', FreePageCtrl);
})();