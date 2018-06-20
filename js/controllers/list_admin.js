(function() {
  var ListAdminCtrl = function($scope, $translate, Session, API, Dialog) {
    $scope.properties = {
      statuses : $app.labels.get('status')
    };
    $scope.flag = false;

    var token = Session.getAuthority().token;
    API.call({
      api : 'lst_role',
      token : token
    }).then(function(data) {
      var roleLabels = new Object;
      for (var i = 0; i < data.length; i++) {
        roleLabels[data[i].id] = data[i].name;
      }

      $scope.roleLabels = roleLabels;

      API.call({
        api : 'lst_admin',
        token : token
      }).then(function(response) {
        $scope.accounts = response;
      }, function(code) {
        Dialog.error(code);
      });
    });

    $scope.remove = function(account) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('ACCOUNT.MESSAGE.CONFIRM_DELETE')
      }).then(function(result) {
        if (result) {
          if ($scope.flag) return;
          $scope.flag = true;
          API.call({
            api : 'del_admin',
            token : token,
            id : account.user_id
          }).then(function() {
            var index = $scope.accounts.indexOf(account);
            $scope.accounts.splice(index, 1);
            $scope.flag = false;
            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('ACCOUNT.MESSAGE.DELETE_SUCCEED')
            });
          }, function(code) {
            $scope.flag = false;
            Dialog.error(code);
          });
        }
      });
    };
  };
  ListAdminCtrl.$inject = [ '$scope', '$translate', 'Session', 'API', 'Dialog' ];
  $app.controllers.controller('ListAdminCtrl', ListAdminCtrl);
})();
