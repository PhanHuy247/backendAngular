(function() {
  var GroupCtrl = function($scope, $location, $route, $translate, Session, API, Dialog) {
    $scope.screenGroups = $app.meta.scr_groups;
    $scope.flag = false;
    var token = Session.getAuthority().token;

    API.call({
      api : 'lst_role',
      token : token
    }).then(function(data) {
      $scope.roles = data;

      for (var i = 0; i < $scope.roles.length; i++) {
        $scope.roles[i].checks = new Object;

        if (isSet($scope.roles[i].lst_group)) {
          for (var j = 0; j < $scope.roles[i].lst_group.length; j++) {
            $scope.roles[i].checks[$scope.roles[i].lst_group[j]] = true;
          }
        }
      }
    }, function(code) {
      Dialog.error(code);
    });

    $scope.add = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api : 'reg_role',
        token : token,
        name : $scope.input,
        lst_group : new Array
      }).then(function(data) {
        var newRole = {
          name : $scope.input,
          id : data.id,
          lst_group : new Array,
          checks : new Object
        };

        $scope.roles.push(newRole);
        $scope.input = "";
        $scope.flag = false;
      }, function(code) {
        $scope.flag = false;
        Dialog.error(code);
      });
    };

    $scope.edit = function(role) {
      role.isEditMode = true;
      role.$clone = angular.copy(role);
    };

    $scope.save = function(role) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('ACCOUNT_GROUP.CONFIRM_SAVE_MESSAGE')
      }).then(function(result) {
        if (result) {
          role.lst_group = new Array;
          for ( var key in role.checks) {
            if (role.checks[key] === true) {
              role.lst_group.push(key);
            }
          }

          API.call({
            api : 'upd_role',
            token : token,
            id : role.id,
            name : role.name,
            lst_group : role.lst_group
          }).then(function() {
            role.isEditMode = false;
            Session.clear();

            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('ACCOUNT_GROUP.REQUEST_RESTART')
            }).then(function() {
              location.reload();
            });

          }, function(code) {
            Dialog.error(code);
          });
        } else {
          $scope.discard(role);
        }
      });
    };

    $scope.discard = function(role) {
      var clone = role.$clone;
      delete role.$clone;
      for ( var key in clone) {
        role[key] = clone[key];
      }

      role.isEditMode = false;
    };

    $scope.remove = function(role) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('ACCOUNT_GROUP.CONFIRM_DELETE_MESSAGE')
      }).then(function(result) {
        if (result) {
          if ($scope.flag) return;
          $scope.flag = true;
          API.call({
            api : 'del_role',
            token : token,
            id : role.id
          }).then(function(data) {
            if (role.id === Session.getAuthority().role_id) {
              Dialog.alert({
                title : $translate('DIALOG.INFO_TITLE'),
                message : $translate('CHANGE_PASSWORD.REQUEST_RELOG')
              }).then(function() {
                $location.path($app.entry);
              });
            } else {
              var index = $scope.roles.indexOf(role);

              $scope.roles.splice(index, 1);
              
            }
            $scope.flag = false;
          }, function(code) {
            $scope.flag = false;
            Dialog.error(code);
          });
        }
      });
    };
  };

  GroupCtrl.$inject = [ '$scope', '$location', '$route', '$translate', 'Session', 'API', 'Dialog' ];
  $app.controllers.controller('GroupCtrl', GroupCtrl);
})();