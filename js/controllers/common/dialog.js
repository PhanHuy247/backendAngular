$app.BaseModalCtrl = function($scope, $q, API) {
  $scope.callAPI = function(parameters) {
//  API.call = function(parameters) {
      var deferred = $q.defer();
      API.call(parameters).then(function(data) {
        deferred.resolve(data);
      }, function(errorCode) {
        if (errorCode === 999 && typeof $scope.close === 'function') {
          $scope.close();
        } else {
          deferred.reject(errorCode);
        }
      });
      return deferred.promise;
    };
  
}; 

