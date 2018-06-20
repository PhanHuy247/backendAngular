(function() {
  var AffiliateSettingCtrl = function($scope, $translate, Session, API, Dialog) {
    // get token
    var token = Session.getAuthority().token;
    $scope.flag = false;
    $scope.input = {};
    
    $scope.attributes = {
      status: [{
          value: 1,
          label: $translate('FORM.ENABLE')
        }, {
          value: 0,
          label: $translate('FORM.DISABLE')
        }
      ]
    };
    $scope.input.status = $scope.attributes.status[0].value;
    
    // Render Affiliate list 
    API.call({
      api: 'lst_aff',
      token: token
    }).then(function(res) {
      $scope.affList = res;
    }, function(errorCode) {
      Dialog.error(errorCode);
    });

    // Affiliate add 
    $scope.addAffiliate = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      // request data
      var reqData = {
        api: 'ins_aff',
        token: token,
        aff_name: $scope.input.affName,
        aff_login_id: $scope.input.loginId,
        aff_pwd: $scope.input.password,
        aff_email: $scope.input.email,
        flag: parseInt($scope.input.status)
      };

      API.call(reqData).then(function(data) {
        var newAff = {
          aff_id: data.aff_id,
          aff_name: $scope.input.affName,
          aff_login_id: $scope.input.loginId,
          aff_pwd: $scope.input.password,
          aff_email: $scope.input.email,
          flag: parseInt($scope.input.status)
        };
        
        $scope.affList.push(newAff);

        $scope.input = {};
        $scope.input.status = $scope.attributes.status[0].value;
        $scope.flag = false;
      }, function(errorCode) {
        $scope.flag = false;
        errorProcess($translate, Dialog, errorCode);
      });
    };

    // Edit media
    $scope.affiliateEdit = function(item) {
      item.isEdit = true;
      item.$clone = angular.copy(item);
    };

    // update affiliate
    $scope.affiliateSave = function(item) {
      var reqDataUpdate = {
        api: 'upd_aff',
        token: token,
        aff_id: item.aff_id,
        aff_name: item.aff_name,
        aff_login_id: item.aff_login_id,
        aff_pwd: item.aff_pwd,
        aff_email: item.aff_email,
        flag: parseInt(item.flag)
      };

      // call API
      API.call(reqDataUpdate).then(function() {
        item.isEdit = false;
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('DIALOG_ADVERTISE.SUCCESS.MESSAGE_AFFILIATE_UPDATE')
        }).then(function() {
          item.showError = {};
        });
      }, function(errorCode) {
        errorProcess($translate, Dialog, errorCode, item);
      });
    };

    $scope.affiliateCancel = function(item) {
      var clone = item.$clone;
      delete item.$clone;
      for (var key in clone) {
        item[key] = clone[key];
      }
      item.isEdit = false;
      item.showError = {};
    };
  };
  
  var messageDataHandle = {
    4 : {
      control: '#name',
      name: 'ADVERTISE_COMMON.AFF_NAME'
    },
    5 : {
      control: '#email',
      name: 'AFFILIATE_SETTINGS.AFF_EMAIL'
    },
    6 : {
      control: '#password',
      name: 'AFFILIATE_SETTINGS.AFF_PASSWORD'
    },
    7 : {
      control: '#loginId',
      name : 'AFFILIATE_SETTINGS.AFF_LOGIN_ID'
    },
    8 : {
      control: '#status',
      name: 'FORM.STATUS'
    }
  };
  
  var errorProcess = function(translate, Dialog, errorCode, item) {
    var data = messageDataHandle[errorCode];
    if (isSet(data)) {
      var name = translate(data.name);
      var control = data.control;
      
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate('AFFILIATE_SETTINGS.UPDATE_ERROR', {fieldName: name})
      }).then(function () {
        if (isSet(item) && isSet(item.aff_id)) {
          control += '-' + item.aff_id;
        }
        
        $(control).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };
  
  AffiliateSettingCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('AffiliateSettingCtrl', AffiliateSettingCtrl);
})();