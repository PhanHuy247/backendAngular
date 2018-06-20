(function() {
  var SettingController = function($rootScope, $scope, API) {
    $rootScope.page = 'setting';

    API.call({
      api : 'get_str',
      token : $app.authority.token
    }).then(function(data) {
      try {
        $scope.settings = JSON.parse(data);
      } catch (e) {
        $scope.settings = new Array;
      }
    });

    $scope.add = function() {
      $scope.settings.push({
        key : '',
        value : '',
        decimal : false
      });
    };

    $scope.save = function() {
      var arr = new Array;
      for (var i = 0; i < $scope.settings.length; i++) {
        if (isUnset($scope.settings[i].key) || $scope.settings[i].key.trim().length === 0) {
          $scope.settings.splice(i, 1);
          i--;
        } else {
          arr.push({
            key : $scope.settings[i].key,
            value : $scope.settings[i].value,
            decimal : $scope.settings[i].decimal
          });
        }
      }

      API.call({
        api : 'set_str',
        token : $app.authority.token,
        str : JSON.stringify(arr)
      }).then(function() {
        alert('success');
      });
    };
  };

  SettingController.$inject = [ '$rootScope', '$scope', 'API' ];
  $app.controllers.controller('SettingController', SettingController);
})();