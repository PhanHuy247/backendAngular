(function() {
  var LoginCtrl = function($scope, $modal, $location, $translate, Auth, Dialog) {
    var loginPopup = $modal.open({
      templateUrl : 'partials/core/login_popup.html',
      controller : LoginPopupCtrl,
      backdrop : 'static',
      keyboard : false
    });

    loginPopup.result.then(function() {
      $location.path('/');
    });
  };

  var LoginPopupCtrl = function($scope, $modalInstance, $translate, Auth, Dialog) {
    $scope.authentication = {};
    $scope.login = function() {
      Auth.execute($scope.authentication.email, $scope.authentication.password).then(function() {
        $modalInstance.close();
      }, function(errorCode) {
        errorProcess(errorCode);
      });
    };

    var errorProcess = function(errorCode) {
      var errorName = null;
      switch (errorCode) {
      case 15:
        errorName = 'LOGIN.MESSAGE_ACCOUNT_DISABLE_ERROR';
        break;
      case 10:
      case 20:
        errorName = 'LOGIN.MESSAGE_ACCOUNT_INCORRECT_ERROR';
        break;
      }

      if (isSet(errorName)) {
        Dialog.alert({
          title : $translate('DIALOG.ERROR_TITLE'),
          message : $translate(errorName)
        });
      } else {
        Dialog.error(errorCode);
      }
    };
  };

  LoginPopupCtrl.$inject = [ '$scope', '$modalInstance', '$translate', 'Auth', 'Dialog' ];
  LoginCtrl.$inject = [ '$scope', '$modal', '$location', '$translate', 'Auth', 'Dialog' ];
  $app.controllers.controller('LoginCtrl', LoginCtrl);

})();