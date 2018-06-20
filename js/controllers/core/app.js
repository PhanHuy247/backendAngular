(function() {
  var AppCtrl = function($scope, $location, $translate, Session, API, Language, Dialog) {

    $scope.properties = {
      languages : Language.list()
    };

    $scope.selectedLanguage = Language.get();

    $scope.changeLanguage = function() {
      Dialog.alert({
        title : $translate('DIALOG.INFO_TITLE'),
        message : $translate('ACCOUNT_GROUP.REQUEST_RESTART')
      }).then(function() {
        Language.set($scope.selectedLanguage);
        location.reload();
      });
    };

    $scope.logout = function() {
      var token = Session.getAuthority().token;
      Session.clear();

      API.call({
        api : 'logout',
        token : token
      }).then(function() {
        $location.path($app.entry);
      }, function() {
        $location.path($app.entry);
      });
    };

    $scope.changePassword = function() {
      $location.path('/change_password');
    };
  };

  AppCtrl.$inject = [ '$scope', '$location', '$translate', 'Session', 'API', 'Language', 'Dialog' ];
  $app.controllers.controller('AppCtrl', AppCtrl);
})();