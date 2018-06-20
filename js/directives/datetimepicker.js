(function() {
  $app.ref.directive('datetimepicker', [ '$timeout', 'Language', function($timeout, Language) {
    return {
      templateUrl : 'partials/directives/datetimepicker.html',
      restrict : 'E',
      scope : {
        ngModel : '=',
        ngChange : '&',
        ngLabel : '=',
        ngMin : '=',
        ngMax : '='
      },
      controller : [ '$scope', function($scope) {
      } ],
      link : function($scope, element, attrs, ctrl) {
        if (isSet(attrs.textAlign)) {
          $(element).find('input').addClass('text-' + attrs.textAlign);
        }
        if (isSet(attrs.required)) {
          $(element).find('input').attr('required', 'required');
        }
        if (isSet(attrs.disabled)) {
          $(element).find('input').attr('disabled', 'disabled');
          $(element).find('.add-on').remove();
        }

        $scope.label = attrs.label;

        var format = '';
        var pickTime = attrs.pickTime === "true";
        if (pickTime) {
          format = [ $app.format.date, $app.format.separator, $app.format.time ].join('');
        } else {
          format = $app.format.date;
        }

        if (isSet(attrs.format)) {
          format = attrs.format;
        }
        // startDate
        var startDate = null, endDate = null;

        if (isString(attrs.startDate) && attrs.startDate.length > 0) {
          startDate = LocalTime.from(attrs.startDate, true).time;
        }
        // endDate
        if (isString(attrs.endDate) && attrs.endDate.length > 0) {
          endDate = LocalTime.from(attrs.endDate, true).time;
        }

        // add datetimepicker
        var options = {
          language : Language.get(),
          maskInput : true,
          pickTime : pickTime,
          format : format
        };

        if (isSet(startDate)) {
          options.startDate = startDate;
        }

        if (isSet(endDate)) {
          options.endDate = endDate;
        }

        var container = $(element);

        $(element).datetimepicker(options).on('changeDate', function(e) {
		  $(element).datetimepicker('hide');
          (function(data) {
            $timeout(function() {
              $scope.ngModel = data.localDate;
            });
          })(e);
        });

        $(element).data('datetimepicker').setLocalDate($scope.ngModel);

        $scope.$watch('ngModel', function(time) {
          if (isUnset(time)) {
            return;
          }
          if ($scope.ngMax && $scope.ngMin) {
            var maxDate = new Date($scope.ngMax);
            var minDate = new Date($scope.ngMin);
            
            if(time.getTime() > maxDate.getTime()) {
              $scope.ngModel = maxDate;
              return;
            }
            if(time.getTime() < minDate.getTime()) {
              $scope.ngModel = minDate;
              return;
            }
          }
          
          if (!time instanceof Date) {
            $scope.ngModel = new Date(parseInt(time, 10));
          }

          $(element).data('datetimepicker').setLocalDate($scope.ngModel);

          if (isFunction($scope.ngChange)) {
            $scope.ngChange();
          }
        });
      }
    };
  } ]);
})();