(function() {
  var PurchaseUrlCtrl = function($scope) {
    $scope.links = $app.freePages;
    
    $scope.pages = new Array;

    for (var key in $scope.links) {
      $scope.pages.push($scope.links[key]);
    }

    $scope.pages.sortByKey('order');
  };
  
  PurchaseUrlCtrl.$inject = ['$scope'];
  $app.controllers.controller('PurchaseUrlCtrl', PurchaseUrlCtrl);
})();