(function() {
  $app.ref.directive('sortable', ['Session', function(Session) {
    var token =  Session.getAuthority().token;
    return {
      templateUrl : 'partials/directives/sortable.html',
      restrict : 'E',
      scope : {
        'source' : '=source',
        'active' : '=active',
        'showImage' : '=showImage',
        'keyProp' : '@keyProp',
        'onSave' : '&onSave'
      },
      controller : function($scope) {
        $scope.size = $app.size.gift;
        $scope.activate = function() {
          $scope.active = true;

          $scope.activeSource = angular.copy($scope.source);

          // create order & image-url
          for (var i = 0; i < $scope.activeSource.length; i++) {
            $scope.activeSource[i].order = i;
            
            if ($scope.showImage) {
              //$scope.activeSource[i].imageUrl = $app.imageUrl + '/api=load_img_admin&token=' + token + '&img_id=' + $scope.activeSource[i].id + '&img_kind=4';
              $scope.activeSource[i].hasImage = true;
            }
          }
        };

        $scope.discard = function() {
          $scope.active = false;

          $scope.activeSource = angular.copy($scope.source);
        };

        $scope.save = function() {
          $scope.active = false;

          if (isFunction($scope.onSave)) {
            var orders = $scope.getOrders();
            $scope.onSave({
              orders : orders
            });
          }
        };
      },
      link : function($scope, element, attrs, ctrl) {
        element.find('.sortable').sortable({
          items : 'li'
        });

        $scope.getOrders = function() {
          var orders = {
            byKey : new Object,
            byIndex : new Array
          };

          element.find('.sortable > li').each(function(index) {
            var key = this.getAttribute('key');
            orders.byKey[key] = index;
            orders.byIndex.push(key);
          });

          return orders;
        };
      },
    };

  } ]);
})();