(function() {
  var getHash = function(url) {
    url = url || '';
    return url.split('#')[1];
  };

  var hasPermission = function(role, authorizedRoles) {
    if (isSet(authorizedRoles) && authorizedRoles.length > 0) {
      for (var i = 0; i < authorizedRoles.length; i++) {
        if (role === authorizedRoles[i]) {
          return true;
        }
      }

      return false;
    } else {
      return true;
    }
  };

  var Session = function($cookies, Messenger) {
    return {
      isAuthorized : function(path) {
        var screenInfo = $app.routers[getHash(path)];
        var authority = this.getAuthority();

        return isUnset(screenInfo) || isUnset(screenInfo.roles) || isSet(authority) && hasPermission(authority.role_id, screenInfo.roles);
      },
      getAuthority : function() {
        if (isUnset($app.authority)) {
          try {
            $app.authority = JSON.parse($cookies.authority);
            Messenger.send('auth_succeed', $app.authority.role_id);
          } catch (e) {
            console.log('Invalid authority data in cookies! Request login!');
            delete $app.authority;
            delete $cookies.authority;
          }
        }
        return $app.authority;
      },
      clear : function() {
        delete $app.authority;
        delete $cookies.authority;
      }
    }
  };
  Session.$inject = [ '$cookies', 'Messenger' ];
  $app.services.factory('Session', Session);
})();