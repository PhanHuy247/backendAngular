/*
 * Copy from free_page.js
 * @number : int & >0
 * @name : text
 * There are NOT delete function
 */
(function() {
  var FreePointCtrl = function($scope, $translate, Session, API, Dialog) {
    var token = Session.getAuthority().token;
    $scope.freePoint = {};
    $scope.flag = false;
    
    $scope.setting = {
      itemsPerPage: $app.pageSize,
      numberPagesDisplay: $app.pageDisplay,
      totalItems: 0,
      currentPage: 1
    };
    
    $scope.freePointSelect = function() {
      API.call({
        api: 'lst_free_point',
        token: token,
        skip: 0,
        take: 0
      }).then(function(res) {
        $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.setting.totalItems = res.total;
        $scope.freePoints = res.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.freePointSelect();
    
    // Add
    $scope.add = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api: 'irs_free_point',
        token: token,
        free_point_name: $scope.freePoint.free_point_name,
        free_point_number: $scope.freePoint.free_point_number
      }).then(function(res) {
        $scope.setting.totalItems++;
        if (parseInt($scope.freePoints.length) < parseInt($scope.setting.itemsPerPage)) {
          var newItem = {
            id: res.id,
            free_point_name: $scope.freePoint.free_point_name,
            free_point_number: $scope.freePoint.free_point_number
          };

          $scope.freePoints.push(newItem);
        }
        $scope.freePoint = {};
        $scope.flag = false;
      }, function(errorCode) {
        $scope.flag = false;
        errorProcess($translate, Dialog, errorCode);
      });
    };
    
    
    // update page
    $scope.save = function(item) {
      API.call({
        api: 'upd_free_point',
        token: token,
        id: item.id,
        free_point_name: item.free_point_name,
        free_point_number: item.free_point_number
      }).then(function() {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.FREE_POINT.MESSAGE_UPDATE_SUCCESS')
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
      control : '#name',
      name : 'SETTINGS.FREE_POINT.LB_NAME'
    },
    5 : {
      control : '#number',
      name : 'SETTINGS.FREE_POINT.LB_NUMBER'
    }
  };
  
  var errorProcess = function(translate, Dialog, errorCode, item) {
    var data = messageDataHandle[errorCode];
    
    if (isSet(data)) {
      var name = translate(data.name);
      var control = data.control;
      
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate('SETTINGS.FREE_POINT.MESSAGE_FIELD_ERROR', {fieldName: name})
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
  
  FreePointCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('FreePointCtrl', FreePointCtrl);
})();