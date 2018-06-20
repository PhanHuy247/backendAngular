(function() {
  var Language = function($translate, $cookies) {
    return {
      list : function() {
        return [ {
          value : 'en',
          label : $translate('LAYOUT.LANG.EN')
        }, {
          value : 'jp',
          label : $translate('LAYOUT.LANG.JP')
        } ];
      },
      get : function() {
        var lang = $cookies.lang;

        if (isUnset(lang)) {
          lang = isSet($app.lang) ? $app.lang : this.list()[0].value;
          $cookies.lang = lang;
        }

        return lang;
      },
      set : function(lang) {
        $translate.uses(lang);

        $cookies.lang = lang;
      }
    };
  };

  Language.$inject = [ '$translate', '$cookies' ];

  $app.services.factory('Language', Language);
})();