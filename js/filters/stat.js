(function() {
  $app.filters.filter('stat', [ '$filter', function($filter) {
    return function(input) {
      input = input || 0;

      return $filter('number')(input);
    };
  } ]);
})();