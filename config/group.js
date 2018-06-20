(function() {
  var GroupController = function($rootScope, $scope, $location, API) {
    $rootScope.page = 'groups';
    $scope.flag = false;
    
    $scope.input = {
      flag : 1
    };

    API.call({
      api : 'lst_scr_group',
      token : $app.authority.token
    }).then(function(data) {
      $scope.groups = data;
    }, function(errorCode) {
      console.log('Error Code: ' + errorCode);
    });

    $scope.create = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api : 'ins_scr_group',
        token : $app.authority.token,
        title : $scope.input.title,
        flag : parseInt($scope.input.flag, 10),
        order: parseInt($scope.input.order, 10),
        name: $scope.input.name
      }).then(function(data) {
        var newGroup = angular.copy($scope.input);
        newGroup.id = data.id;

        $scope.groups.push(newGroup);
        $scope.input = {
          flag : 1
        };
        $scope.flag = false;
      });
    };

    $scope.edit = function(group) {
      group.isEdit = true;
      group.$clone = angular.copy(group);
    };

    $scope.cancelEdit = function(group) {
      var clone = group.$clone;
      delete group.$clone;
      for (key in clone) {
        group[key] = clone[key];
      }

      group.isEdit = false;
    };

    $scope.save = function(group) {
      API.call({
        api : 'upd_scr_group',
        token : $app.authority.token,
        id : group.id,
        title : group.title,
        flag : parseInt(group.flag, 10),
        order : parseInt(group.order, 10),
        name: group.name
      }).then(function(data) {
        group.isEdit = false;
      });
    };
  };

  GroupController.$inject = [ '$rootScope', '$scope', '$location', 'API' ];
  $app.controllers.controller('GroupController', GroupController);
})();