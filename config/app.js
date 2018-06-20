(function() {
  var app = angular.module('config', [ 'ngRoute', 'controllers', 'services', 'angular-md5', 'ui.bootstrap', 'pascalprecht.translate' ]);

  app.config([ '$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
    $routeProvider.when('/login', {
      templateUrl : 'config/login.html',
      controller : 'LoginController'
    }).when('/group', {
      templateUrl : 'config/group.html',
      controller : 'GroupController'
    }).when('/screen', {
      templateUrl : 'config/screen.html',
      controller : 'ScreenController'
    }).when('/setting', {
      templateUrl : 'config/setting.html',
      controller : 'SettingController'
    }).otherwise({
      redirectTo : '/login'
    });
  } ]).run([ '$rootScope', '$q', '$location', function($rootScope, $q, $location) {
    var redirect = $q.defer();

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      var hash = next.split('#')[1];

      if (hash === '/login') {
        // clear authority
        delete $app.authority;
      } else if (isUnset($app.authority)) {
        event.preventDefault();
        redirect.resolve();
      }
    });

    redirect.promise.then(function() {
      $location.path('/login');
    });
  } ]);

  $app.entry = '/login';
  $app.controllers = angular.module('controllers', []);
  $app.services = angular.module('services', []);
})();