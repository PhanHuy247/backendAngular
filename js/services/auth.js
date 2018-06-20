(function() {
  var Auth = function($cookies, md5, API, Messenger) {
    return {
      execute : function(email, password) {
        return API.call({
          api : 'login_admin',
          email : email,
          pwd : md5.createHash(password)
        }).then(function(response) {
          // create authority object
          $app.authority = response;

          $cookies.authority = JSON.stringify($app.authority);

          Messenger.send('auth_succeed', $app.authority.role_id);
        });
      }
    }
  };
  Auth.$inject = [ '$cookies', 'md5', 'API', 'Messenger' ];

  $app.services.factory('Auth', Auth);
})();