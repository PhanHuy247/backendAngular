(function() {
  $app.ref.directive('selectpicker', [ '$timeout', function($timeout) {
    return {
      template : '<select class="span12 selectpicker " multiple ng-disabled="ngDisabled"  ></select>',
      restrict : 'E',
      scope : {
        ngModel : '=',
        ngSource : '=',
        ngDisabled : '=',
        datacontainer : '=',
        pickerId : '@',
        size: '='
      },
      controller : [ '$scope', function($scope) {
      } ],
      link : function($scope, element, attrs) {
        var isSelectAll = false;
        var select = $(element).find('select[multiple]');
        $scope.$watch(function() {
          return $scope.ngSource;
        }, function(data) {
          select.empty();

          for (var i = 0; i < data.length; i++) {
            select.append($('<option />').attr('value', data[i].value).text(data[i].label));
          }

          select.selectpicker('refresh');
        }, true);

        
        $scope.$watch(function() {
          return $scope.ngModel;
        }, function(data) {
          if (isSet(data)) {
            if ($scope.pickerId=="cm_code"){
              if (data[0]==0)
                data = editAll(data);
            }
              select.selectpicker('val', data);
          }
        }, true);
        
       
        select.selectpicker({
          title : attrs.title,
          container : 'body',
          size : 13
        });

        select.change(function() {

          var arr = select.val();

          if (isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
              arr[i] = parseIntNullable(arr[i]);
            }
          } else {
            arr = new Array;
          }
          $timeout(function() {
            $scope.ngModel = arr;
          });
        });

        var editAll = function(data){
          if (data.length-1!=$scope.size)
            isSelectAll = true;
          else
            isSelectAll = (!isSelectAll);
          var newData = new Array();
          if (isSelectAll)
            for (var i=1; i<=$scope.size; i++){
              newData.push(i);
            }
          return newData;
        }
      }
    };
  } ]);
})();