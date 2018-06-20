(function() {
  var UpdateAdminCtrl = function($scope, $routeParams, $location, $translate, md5, Session, API, Dialog) {
    var token = Session.getAuthority().token;
    // pattern check email and password
    var pattern = /^([a-z0-9A-Z]+)$/;
    $scope.flag = false;
    
    $scope.properties = {
      statuses : $app.labels.get('status')
    };

    $scope.user = {
      flag : $scope.properties.statuses[0].value
    };

    $scope.editMode = isSet($routeParams.id);

    API.call({
      api : 'lst_role',
      token : token
    }).then(function(response) {
      $scope.properties.roles = response;

      if ($scope.editMode) {
        // add
        API.call({
          api : 'get_admin_detail',
          token : token,
          id : $routeParams.id
        }).then(function(response) {
          $scope.user = response;

          $scope.save = function() {
            if (!isSet($scope.user.password)) {
              Dialog.alert({
                title: $translate('DIALOG.WARNING_TITLE'),
                message: $translate('ACCOUNT.MESSAGE.PASSWORD_NULL')
              });
            }else if ($scope.user.password !== $scope.user.confirmedPassword) {
              Dialog.alert({
                title : $translate('DIALOG.WARNING_TITLE'),
                message : $translate('CHANGE_PASSWORD.PASSWORD_NOT_MATCHED')
              });
            } else if(!pattern.test($scope.user.password)) {
              Dialog.alert({
                title : $translate('DIALOG.ERROR_TITLE'),
                message : $translate('ACCOUNT.MESSAGE.PASSWORD_ERROR')
              }).then(function() {
                $('#password').focus();
              });
            } else {
              API.call({
                api : 'upd_admin',
                token : token,
                id : $routeParams.id,
                name : $scope.user.name,
                email : $scope.user.email,
                pwd : isUnset($scope.user.password) || $scope.user.password.toString().length === 0 ? undefined : md5.createHash($scope.user.password),
                original_pwd : isUnset($scope.user.password) || $scope.user.password.toString().length === 0 ? undefined : $scope.user.password,
                flag : $scope.user.flag,
                role_id : $scope.user.role_id
              }).then(function() {
                Dialog.alert({
                  title : $translate('DIALOG.INFO_TITLE'),
                  message : $translate('DIALOG_ALERT.UPDATE_USER.MESSAGE')
                }).then(function() {
                  $location.path('/account');
                });
              }, function(code) {
                errorProcess($translate, Dialog, code, $scope.user);
              });
            }
          };
        }, function(code) {
          Dialog.error(code);
        });
      } else {
        // add
        $scope.user.role_id = $scope.properties.roles[0].id;

        $scope.save = function() {
          if ($scope.user.password !== $scope.user.confirmedPassword) {
            Dialog.alert({
              title : $translate('DIALOG.WARNING_TITLE'),
              message : $translate('CHANGE_PASSWORD.PASSWORD_NOT_MATCHED')
            });
          } else if(!pattern.test($scope.user.password)) {
            Dialog.alert({
              title : $translate('DIALOG.ERROR_TITLE'),
              message : $translate('ACCOUNT.MESSAGE.PASSWORD_ERROR')
            }).then(function() {
              $('#password').focus();
            });
          } else {
            if ($scope.flag) return;
            $scope.flag = true;
            API.call({
              api : 'reg_admin',
              token : token,
              email : $scope.user.email,
              pwd : md5.createHash($scope.user.password),
              original_pwd : $scope.user.password,
              flag : $scope.user.flag,
              role_id : $scope.user.role_id,
              name : $scope.user.name
            }).then(function(data) {
              $scope.flag = false;
              Dialog.alert({
                title : $translate('DIALOG.INFO_TITLE'),
                message : $translate('DIALOG_ALERT.ADD_USER.MESSAGE_SUCCESS')
              }).then(function() {
                $location.path('/account');
              });
            }, function(code) {
              $scope.flag = false;
              errorProcess($translate, Dialog, code, $scope.user);
            });
          }
        };
      }
    }, function(code) {
      Dialog.error(code);
    });
  };
  
  var handleMessageData = {
    4 : {
      control : '#email',
      message : 'ACCOUNT.MESSAGE.ACCOUNT_ID_ERROR'
    }
  };
  var errorProcess = function(translate, Dialog, errorCode, item) {
    if (isSet(handleMessageData[errorCode])) {
      var data = handleMessageData[errorCode];
      var message = translate(data.message);
      
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate(message)
      }).then(function () {
        $(data.control).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };
  
  UpdateAdminCtrl.inject = [ '$scope', '$routeParams', '$location', '$translate', 'md5', 'Session', 'API', 'Dialog' ];
  $app.controllers.controller('UpdateAdminCtrl', UpdateAdminCtrl);
})();