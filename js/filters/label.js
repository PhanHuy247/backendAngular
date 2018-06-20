(function() {
  $app.filters.filter('label', [ '$translate', function($translate) {
    var display = function(value, translate) {
      return isSet(value) ? translate ? $translate(value) : value : $translate('LAYOUT.NO_DATA');
    };

    return function(input, options) {
      if (isUnset(input)) {
        return display();
      }

      if (isUnset(options) || !isArray(options) || options.length === 0) {
        return input;
      }

      if (options.length === 1) {
        options[1] = false;
      }

      var source = options[0];
      var translate = options[1];

      if (isArray(source) && source.length > 0) {

        var valueLabelFormat = isSet(source[0].value) && isSet(source[0].label);

        if (valueLabelFormat) {
          for (var i = 0; i < source.length; i++) {
            if (source[i].value === input) {
              return display(source[i].label, translate)
            }
          }

          return display();
        } else {
          return display(source[input], translate);
        }
      } else {
        return display(source[input], translate);
      }
    };
  } ]);
})();