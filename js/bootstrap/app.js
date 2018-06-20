(function() {
  var modules = [ 
      'ngRoute',
      'ngCookies', 
      'ngSanitize', 
      'controllers', 
      'services', 
      'filters', 
      'angular-md5', 
      'ui.bootstrap', 
      'pascalprecht.translate', 
      'textAngular',
      'com.2fdevs.videogular',
      'com.2fdevs.videogular.plugins.controls' 
  ];

  $app.ref = angular.module($app.appName, modules);

  var controllerName = function(text) {
    var els = text.split('_');

    for (var i = 0; i < els.length; i++) {
      els[i] = els[i].charAt(0).toUpperCase() + els[i].slice(1);
    }

    return els.join('') + 'Ctrl';
  };

  var translateProvider;

  $app.ref.config([ '$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
    for ( var path in $app.routers) {
      $routeProvider.when(path, {
        templateUrl : 'partials/' + ($app.routers[path].core ? 'core/' : '') + $app.routers[path].controller + '.html',
        controller : controllerName($app.routers[path].controller)
      });
    }

    $routeProvider.otherwise({
      redirectTo : $app.entry
    });

    // config translations
    for ( var key in $texts) {
      $translateProvider.translations(key, $texts[key]);
    }

    $translateProvider.fallbackLanguage($app.lang);
    translateProvider = $translateProvider;
  } ]).run([ '$rootScope', '$q', '$anchorScroll', '$location', '$translate', 'Session', 'Language', function($rootScope, $q, $anchorScroll, $location, $translate, Session, Language) {
    translateProvider.uses(Language.get());
    $app.labels = new LabelManager($translate);
    $('#loading-area').remove();
    $('#main-body').show();
    var deferred = $q.defer();

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      if (!Session.isAuthorized(next)) {
        event.preventDefault();
        deferred.resolve();
      } else {
        // remove all datetimepicker widgets
        $('.bootstrap-datetimepicker-widget').remove();
      }
    });

    $rootScope.$on('$locationChangeSuccess', function(event, current, old) {
      $anchorScroll();
    });
    deferred.promise.then(function() {
      $location.path($app.entry);
    });

    // remove all script tags after load all javascript to VM
    $('script').remove();
  } ]);
})();
