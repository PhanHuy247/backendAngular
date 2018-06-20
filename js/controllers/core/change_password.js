(function() {
  var ChangePasswordCtrl = function($scope, $location, $translate, Session, API, Dialog, md5) {
    $scope.input = {};
    $scope.changePassword = function() {
      if ($scope.input.newPassword !== $scope.input.confirmPassword) {
        Dialog.alert({
          title : $translate('DIALOG.WARNING_TITLE'),
          message : $translate('CHANGE_PASSWORD.PASSWORD_NOT_MATCHED')
        });

        return;
      }

      var token = Session.getAuthority().token;

      API.call({
        api : 'chg_pwd_admin',
        token : token,
        old_pwd : md5.createHash($scope.input.oldPassword),
        new_pwd : md5.createHash($scope.input.newPassword),
        original_pwd : $scope.input.newPassword
      }).then(function() {
        Session.clear();
        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('CHANGE_PASSWORD.REQUEST_RELOG')
        }).then(function() {
          $location.path($app.entry);
        });
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };
  };

  ChangePasswordCtrl.$inject = [ '$scope', '$location', '$translate', 'Session', 'API', 'Dialog', 'md5' ];
  $app.controllers.controller('ChangePasswordCtrl', ChangePasswordCtrl);
})();