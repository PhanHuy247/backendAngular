(function() {
  $app.filters.filter('local', [ '$filter', function($filter) {
    return function(input, options) {
      if (isUnset(input)) {
        return $filter('translate')('LAYOUT.NO_DATA');
      } else if (input instanceof Date) {
        // do nothing
      } else if (isString(input)) {
        input = LocalTime.from(input, true).time;
      } else {
        // no filter
        return input;
      }
	  
	  var localOffsetInHour = Date.timezone();
	  var serverOffsetInHour = $app.timezone;
	  
	  input.setHours(input.getHours() - localOffsetInHour + serverOffsetInHour);
      
	  if (isUnset(options)) {
        options = [ false, $app.format.date ];
      }

      if (isUnset(options[0])) {
        options[0] = false;
      }

      if (isUnset(options[1])) {
        options[1] = options[0] ? $app.format.date + $app.format.separator + $app.format.time : $app.format.date;
      }

      return $filter('date')(input, options[1]);
    };
  } ]);
})();