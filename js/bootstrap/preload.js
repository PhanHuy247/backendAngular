(function() {
  var canStartApp = true;
  window.addEventListener('load', function() {
    // create LoadQueue
    var loader = new createjs.LoadQueue();

    loader.on('progress', function() {
      updateProgress(loader.progress)
    });

    loader.on('error', function(event) {
      canStartApp = false;
      highlightError();
      loader.removeAll();
    });

    loader.on('filestart', function(event) {
      updateTarget(event.item.src);
    });

    loader.on('fileload', function(event) {
      document.body.appendChild(event.result);
    });
    loader.on('complete', function(event) {
      bootstrap();
    });

    loader.loadManifest(manifest);
  }, false);

  var highlightError = function() {
    document.getElementById('loading-target').style.color = 'red';
    document.getElementById('error-message').innerHTML = "Can not find this file, please check again.";
  };

  var updateProgress = function(overall) {
    document.getElementById('loading-overall-progress').innerHTML = (overall * 100).toFixed(0) + '%';
  };

  var updateTarget = function(target) {
    document.getElementById('loading-target').innerHTML = target;
  }

  var createAppConfig = function() {
    try {
      var config = JSON.parse($app.meta.string);

      if (isArray(config)) {
        for (var i = 0; i < config.length; i++) {
          var value = config[i].decimal ? parseIntNullable(config[i].value) : config[i].value;

          var el = config[i].key.split('.');

          var setting = $app;
          for (var j = 0; j < el.length; j++) {
            if (j === el.length - 1) {
              setting[el[j]] = value;
            } else {
              if (isUnset(setting[el[j]])) {
                setting[el[j]] = new Object;
              }
              setting = setting[el[j]];
            }
          }
        }
      }
    } catch (e) {
      console.log('Initializing app configuration failed!')
    }
  };

  var bootstrap = function() {
    $.ajax({
      type : 'post',
      url : $app.apiUrl,
      data : JSON.stringify({
        api : 'init'
      }),
      dataType : 'json',
      success : function(response) {
        if (response.code === 0) {
		  if (response.data.time_zone != null && response.data.time_zone != "") {
			$app.timezone = response.data.time_zone;
		  }
		  
          $app.meta = response.data;
          createAppConfig();
          loadApp();
        } else {
          bootstrapFail();
        }
      },
      error : bootstrapFail
    });
  };

  var bootstrapFail = function() {
    alert("Could not connect to server!");
  };
  
  var loadApp = function() {
    var appLoader = new createjs.LoadQueue();

    appLoader.on('progress', function() {
      updateProgress(appLoader.progress);
    });

    appLoader.on('filestart', function(event) {
      updateTarget(event.item.src);
    });

    appLoader.on('error', function(event) {
      canStartApp = false;
      highlightError();
      appLoader.removeAll();
    });

    appLoader.on('fileload', function(event) {
      document.body.appendChild(event.result);
    });

    appLoader.on('complete', function() {
      if (canStartApp) {
        load();
      } else {
        //bootstrapFail();
      }
    });

    var appControllers = [];
    $app.routers = new Object;

    for (var i = 0; i < $app.meta.scr_groups.length; i++) {
      // $app.meta.scr_groups[i].roles = [ $app.meta.roles[0].id ];

      for (var j = 0; j < $app.meta.scr_groups[i].screens.length; j++) {
        var screenInfo = $app.meta.scr_groups[i].screens[j];

        if (isSet(screenInfo)) {
          appControllers.push({
            src : 'js/controllers/' + screenInfo.controller + '.js',
            type : createjs.LoadQueue.JAVASCRIPT
          });

          // init routers map
          $app.routers[screenInfo.path] = {
            roles : $app.meta.scr_groups[i].roles,
            name : screenInfo.name,
            title : screenInfo.title,
            order : screenInfo.order,
            controller : screenInfo.controller
          };
        }
      }
    }

    $app.routers[$app.entry] = {
      roles : null,
      core : true,
      controller : 'login'
    };
    $app.routers['/change_password'] = {
      roles : [],
      core : true,
      controller : 'change_password'
    };
    $app.routers['/'] = {
      roles : [],
      core : true,
      controller : 'index'
    };

    if (appControllers.length > 0) {
      appLoader.loadManifest(appControllers);
    } else {
      load();
    }
  };

  var load = function() {
    angular.bootstrap(document, [ $app.appName ]);
  };

})();