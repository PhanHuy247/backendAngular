(function() {
  var LoginController = function($rootScope, $scope, $location, md5, API) {
    $rootScope.page = 'login';

    $scope.login = function() {
      API.call({
        api : 'login_tool',
        user_name : $scope.input.loginId,
        pwd : md5.createHash($scope.input.password)
      }).then(function(data) {
        $app.authority = data;
        $location.path('/setting');
      });
    };
  };

  LoginController.$inject = [ '$rootScope', '$scope', '$location', 'md5', 'API' ];
  $app.controllers.controller('LoginController', LoginController);
})();