(function() {
  var ScreenController = function($rootScope, $scope, $modal, API) {
    $rootScope.page = 'screens';
    $scope.input = {
      flag : 1,
      order : -1
    };
    // screen management
    API.call({
      api : 'lst_scr',
      token : $app.authority.token
    }).then(function(data) {
      $scope.screens = data.list_scr;
      $scope.groups = data.list_scr_group;
    });

    $scope.sort = function(groupId, order) {
      return groupId + '-' + order;
    };

    $scope.create = function() {
      API.call({
        api : 'ins_scr',
        token : $app.authority.token,
        group_id : $scope.input.group_id,
        title : $scope.input.title,
        flag : parseInt($scope.input.flag, 10),
        path : $scope.input.path,
        name : $scope.input.name,
        controller : $scope.input.controller,
        order : parseInt($scope.input.order, 10)
      }).then(function(data) {
        var newScreen = angular.copy($scope.input);

        newScreen.id = data.id;

        $scope.screens.push(newScreen);

        $scope.input = {
          flag : 1,
          order : -1
        };
      });
    };

    $scope.edit = function(screen) {
      screen.isEdit = true;
      screen.$clone = angular.copy(screen);
    };
    $scope.save = function(screen) {
      API.call({
        api : 'upd_scr',
        token : $app.authority.token,
        id : screen.id,
        group_id : screen.group_id,
        title : screen.title,
        flag : parseInt(screen.flag, 10),
        path : screen.path,
        name : screen.name,
        controller : screen.controller,
        order : parseInt(screen.order, 10)
      }).then(function(data) {
        screen.isEdit = false;
      });
    };

    $scope.cancelEdit = function(screen) {
      var clone = screen.$clone;
      delete screen.$clone;

      for (key in clone) {
        screen[key] = clone[key];
      }

      screen.isEdit = false;
    };

    // api management
    var apis;

    API.call({
      api : 'lst_api',
      token : $app.authority.token
    }).then(function(data) {
      apis = data;
    });

    $scope.configAPIs = function(screen) {
      $modal.open({
        templateUrl : 'config/config_api.html',
        controller : ConfigAPI,
        backdrop : 'static',
        keyboard : false,
        resolve : {
          data : function() {
            return {
              screen : screen,
              apis : apis
            };
          }
        }
      }).result.then(function(result) {
        if (isSet(result)) {
          var selectedAPIs = new Array;
          for ( var api in result) {
            if (result[api] === true) {
              selectedAPIs.push(api);
            }
          }

          API.call({
            api : 'set_scr_api',
            token : $app.authority.token,
            id : screen.id,
            lst_api : selectedAPIs
          }).then(function() {
            screen.lst_api = selectedAPIs;
          });
        }
      });
    };
  };

  var ConfigAPI = function($scope, $modalInstance, data) {
    $scope.screen = data.screen;
    $scope.apis = data.apis;
    $scope.checks = new Object;

    for (var i = 0; i < data.screen.lst_api.length; i++) {
      $scope.checks[data.screen.lst_api[i]] = true;
    }

    $scope.discard = function() {
      $modalInstance.close();
    };

    $scope.save = function() {
      $modalInstance.close($scope.checks);
    };

  };

  ScreenController.$inject = [ '$rootScope', '$scope', '$modal', 'API' ];

  $app.controllers.controller('ScreenController', ScreenController);
})();