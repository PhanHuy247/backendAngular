(function() {
  var MediaSettingCtrl = function($scope, $translate, Session, API, Dialog) {
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

    // Media list 
    API.call({
      api: 'lst_media',
      token: token
    }).then(function(res) {
      $scope.mediaList = res.media_lst;
      $scope.affiliateList = res.aff_lst;
      $scope.input.affId = $scope.affiliateList[0].aff_id;
    }, function(errorCode) {
      Dialog.error(errorCode);
    });

    // Media add 
    $scope.addMedia = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      
      // request data
      var reqData = {
        api: 'ins_media',
        token: token,
        aff_id: $scope.input.affId,
        media_name: $scope.input.mediaName,
        media_url: $scope.input.mediaUrl,
        flag: parseInt($scope.input.status)
      };
      
      API.call(reqData).then(function(data) {
        var newMedia = {
          media_id: data.media_id,
          aff_id: $scope.input.affId,
          media_name: $scope.input.mediaName,
          media_url: $scope.input.mediaUrl,
          flag: parseInt($scope.input.status)
        };

        $scope.mediaList.push(newMedia);

        $scope.input = {};
        $scope.input.affId = $scope.affiliateList[0].aff_id;
        $scope.input.status = $scope.attributes.status[0].value;
        $scope.flag = false;
      }, function(errorCode) {
        $scope.flag = false;
        errorProcess($translate, Dialog, errorCode);
      });
    };

    // Edit media
    $scope.mediaEdit = function(item) {
      item.isEdit = true;
      item.$clone = angular.copy(item);
    };

    // update media
    $scope.mediaSave = function(item) {
      if ($scope.flag) return;
      $scope.flag = true;
      var reqDataUpdate = {
        api: 'upd_media',
        token: token,
        media_id: item.media_id,
        aff_id: item.aff_id,
        media_name: item.media_name,
        media_url: item.media_url,
        flag: parseInt(item.flag)
      };

      // call API
      API.call(reqDataUpdate).then(function() {
        item.isEdit = false;
        item.showError = {};
        $scope.flag = false;
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('DIALOG_ADVERTISE.SUCCESS.MEDIA_UPDATE')
        });
      }, function(errorCode) {
        $scope.flag = false;
        errorProcess($translate, Dialog, errorCode, item);
      });
    };

    // cancel
    $scope.mediaCancel = function(item) {
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
      control : '#mediaName',
      name : 'MEDIA_SETTINGS.MEDIA_NAME'
    },
    5 : {
      control : '#url',
      name : 'MEDIA_SETTINGS.MEDIA_URL'
    },
    6 : {
      control : '#status',
      name : 'FORM.STATUS'
    }
  };
  
  var errorProcess = function(translate, Dialog, errorCode, item) {
    var data = messageDataHandle[errorCode];
    
    if (isSet(data)) {
      var name = translate(data.name);
      var control = data.control;
      
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate('MEDIA_SETTINGS.MESSAGE_ERROR', {fieldName: name})
      }).then(function() {
        if (isSet(item) && isSet(item.media_id)) {
          control += '-' + item.media_id;
        }
        
        $(control).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };

  MediaSettingCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('MediaSettingCtrl', MediaSettingCtrl);
})();