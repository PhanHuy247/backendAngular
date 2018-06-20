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
  
  function downloadFileCSV(url) {
	var element = document.createElement('a');
	element.href = url;
	document.body.appendChild(element);
	
	return element.click();
  }

  var CSV = function($http, $q, $location) {
    return {
      get : function(data) {
        var deferred = $q.defer();
        data = refine(data);
        $http.post($app.apiUrl, data).success(function(response, status, headers, config) {
          try {
            downloadFileCSV(response.data.csv_url);

            deferred.resolve();
          } catch (e) {
            deferred.reject(e);
          }
        }).error(function() {
          // TODO: handle network error
          deferred.reject();
        });

        return deferred.promise;
      }
    };
  };
  CSV.$inject = [ '$http', '$q', '$location' ];
  $app.services.factory('CSV', CSV);
})();