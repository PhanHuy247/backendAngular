(function () {
  var CmCodeRegisterCtrl = function ($scope, $location, $routeParams, $translate, Session, API, Dialog) {

    // get token
    var token = Session.getAuthority().token;

    $scope.attributes = {
      status: $app.labels.get('status'),
      trackUrl: $app.labels.get('trackUrl')
    };

    $scope.input = {
      isEdit: true,
      isUpdate: false,
      status: $scope.attributes.status[0].value,
      type: $scope.attributes.trackUrl[0].value
    };

    var id = $routeParams.id;

    if (isSet(id)) {
      $scope.input = {
        isEdit: true,
        isUpdate: true
      };

      // get CM code detail by id
      var reqDataGetCmCodeDetail = {
        api: 'get_cm_code_detail',
        token: token,
        cm_code_id: id
      };

      API.call(reqDataGetCmCodeDetail).then(function (cmCode) {
        $scope.aff_name = cmCode.aff_name;
        $scope.media_name = cmCode.media_name;
        $scope.cm_code = cmCode.cm_code;
        $scope.input.status = cmCode.flag;
        $scope.input.money = cmCode.money;
        $scope.input.type = cmCode.type;
        $scope.input.registration = cmCode.reg_url;
        $scope.input.purchase = cmCode.pur_url;
        $scope.input.description = cmCode.des;
        $scope.input.cmCode = cmCode.cm_code;
        $scope.input.affId = cmCode.aff_id;
        $scope.input.mediaId = cmCode.media_id;
        $scope.input.redirect = cmCode.redirect_url;
      }, function (errorCode) {
        Dialog.error(errorCode);
      });

      $scope.updateCmCode = function () {
        var reqDataUpd = {
          api: 'upd_cm_code',
          token: token,
          cm_code_id: id,
          flag: parseInt($scope.input.status),
          money: $scope.input.money,
          type: parseInt($scope.input.type),
          reg_url: $scope.input.registration,
          pur_url: $scope.input.purchase,
          des: $scope.input.description,
          aff_id: $scope.input.affId,
          media_id: $scope.input.mediaId,
          cm_code: $scope.input.cmCode,
          redirect_url: $scope.input.redirect
        };
        console.log('===dl gui lên de upd ======');
        console.log(reqDataUpd);
        API.call(reqDataUpd).then(function () {
          Dialog.alert({
            title: $translate('DIALOG.INFO_TITLE'),
            message: $translate('DIALOG_ADVERTISE.SUCCESS.MESSAGE_UPDATE_CM_CODE')
          }).then(function () {
            $location.path('/advertise/cm_code_list');
          });
        }, function (errorCode) {
          errorProcess($translate, Dialog, errorCode, $scope.input);
        });
      };
    }

    // Load affiliate and media
    API.call({
      api: 'init_reg_cm_code',
      token: token
    }).then(function (res) {
      $scope.list = res;
      $scope.input.affId = $scope.list[0].aff_id;
      $scope.changeAff();
    }, function (errorCode) {
      Dialog.error(errorCode);
    });

    // Change affiliate
    $scope.changeAff = function () {
      for (var i = 0; i < $scope.list.length; i++) {
        if ($scope.list[i].aff_id === $scope.input.affId) {
          $scope.mediaList = $scope.list[i].media_lst;
          $scope.input.mediaId = $scope.list[i].media_lst[0].media_id;
        }
      }
    };

    // CM code register 
    $scope.registerCmCode = function () {
      // request data
      var reqDataInsCmCode = {
        api: 'ins_cm_code',
        token: token,
        aff_id: $scope.input.affId,
        media_id: $scope.input.mediaId,
        cm_code: $scope.input.cmCode,
        type: parseInt($scope.input.type),
        money: $scope.input.money,
        reg_url: $scope.input.registration,
        pur_url: $scope.input.purchase,
        des: $scope.input.description,
        flag: parseInt($scope.input.status),
        redirect_url: $scope.input.redirect
      };
      console.log('===dl gui lên de insert ======');
      console.log(reqDataUpd);
      API.call(reqDataInsCmCode).then(function () {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('DIALOG_ADVERTISE.SUCCESS.REGISTER_CM_CODE')
        }).then(function () {
          $scope.input = {
            isEdit: true,
            affId: $scope.list[0].aff_id,
            status: $scope.attributes.status[0].value,
            type: $scope.attributes.trackUrl[0].value
          };
          $scope.changeAff();
        });
      }, function (errorCode) {
        errorProcess($translate, Dialog, errorCode, $scope.input);
      });
    };
  };
  var messageDataHandle = {
    4: {
      control: '#cmCode',
      name: 'cmCode',
      message: 'REGISTER_CM_CODE.RCC_CM_CODE'
    },
    5: {
      control: '#registration',
      name: 'registration',
      message: 'REGISTER_CM_CODE.RCC_REGISTRATION'
    },
    6: {
      control: '#type',
      name: 'type',
      message: 'REGISTER_CM_CODE.RCC_TRACK_URL'
    },
    7: {
      control: '#money',
      name: 'money',
      message: 'REGISTER_CM_CODE.RCC_MONEY'
    },
    8: {
      control: '#status',
      name: 'status',
      message: 'FORM.STATUS'
    },
    9: {
      control: '#purchase',
      name: 'purchase',
      message: 'REGISTER_CM_CODE.RCC_PURCHASE'
    },
    10: {
      control: '#redirect',
      name: 'redirect',
      message: 'REGISTER_CM_CODE.RCC_REDIRECT_URL'
    },
    70: {
      control: '#cmCode',
      name: 'cmCode',
      message: 'REGISTER_CM_CODE.RCC_CM_CODE',
      messagePlus: 'REGISTER_CM_CODE.ALREADY_EXIST'

    }
  };

  var errorProcess = function (translate, Dialog, errorCode, item) {
    var data = messageDataHandle[errorCode];
    item.showError = {};

    if (isSet(data)) {
      var messagePlus = data.messagePlus ? translate(data.messagePlus) : '';
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate('REGISTER_CM_CODE.SAVE_ERROR', {
          fieldName: translate(data.message)
        }) + '. ' + messagePlus
      }).then(function () {
        item.showError[data.name] = true;
        $(data.control).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };

  CmCodeRegisterCtrl.$inject = ['$scope', '$location', '$routeParams', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('CmCodeRegisterCtrl', CmCodeRegisterCtrl);
})();