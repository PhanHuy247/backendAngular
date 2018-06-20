(function() {
  function refine(data) {
    for ( var key in data) {
      var remove = isUnset(data[key]);
      remove |= isString(data[key]) && data[key].length === 0;
      remove |= isArray(data[key]) && data[key].length === 0;

      if (remove) {
        delete data[key];
      }
    }

    return data;
  }

  var API = function($http, $q, $location, $translate, Dialog) {
    return {
      call : function(data, isGetAllResponse, urlApiImage) {
        var deferred = $q.defer();
        data = refine(data);
        var urlApi = urlApiImage ? urlApiImage : $app.apiUrl;
        $http.post(urlApi, data).success(function(response) {
          
          if (isSet(response)) {
            if (response.code === 0) {
              deferred.resolve(response.data);
              return;
            }
            
            if (response.code === 3) {
              $location.path($app.entry);
              return;
            }
            
            if(response.code === 999 && $translate != null && Dialog != null) {
              Dialog.error($translate('DIALOG.DONT_PERMISSION')).then(function() {
              });;
              deferred.reject(response.code);
            }
          }
          if(isGetAllResponse === true || response.code === 1 || response.code === 2 || response.code === 3 ) {
            deferred.reject(response);
          }else {
            deferred.reject(response.code);
          }
          

        }).error(function() {
          // TODO: handle network error
          deferred.reject();
        });

        return deferred.promise;
      }
    };
  };
  API.$inject = [ '$http', '$q', '$location', '$translate', 'Dialog'];
  $app.services.factory('API', API);
})();