(function() {
  var Messenger = function($rootScope, $q) {
    return {
      send : function(message, data) {
        $app.inbox = data;
        $rootScope.$broadcast(message);
      },
      inbox : function() {
        return $app.inbox;
      }
    };
  };
  Messenger.$inject = [ '$rootScope', '$q' ];
  $app.services.factory('Messenger', Messenger);
})();