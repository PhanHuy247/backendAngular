(function() {
  var DialogCtrl = function($scope, $modal) {
    $scope.$on('show_dialog', function() {
      var data = $app.inbox;

      var dialog = $modal.open({
        templateUrl : 'partials/core/dialog.html',
        controller : Dialog,
        backdrop : 'static',
        keyboard : false,
        resolve : {
          data : function() {
            return data;
          }
        }
      });

      dialog.result.then(function(result) {
        if (isSet(data.deferrer) && isFunction(data.deferrer.resolve)) {
          data.deferrer.resolve(result);
        }
      });
    });
  };

  var Dialog = function($scope, $modalInstance, data) {
    $scope.data = data;
    $scope.isConfirmDialog = data.type === 'confirm';

    $scope.close = function(result) {
      $modalInstance.close(result);
    };
  };

  DialogCtrl.$inject = [ '$scope', '$modal' ];
  $app.controllers.controller('DialogController', DialogCtrl);

})();