(function() {
  var StaticPageCtrl = function($scope, $q, $translate, Session, API, Dialog) {
    var tasks = new Array;
    var token = Session.getAuthority().token;
    $scope.properties = {
      pages : [ {
        value : 0,
        label : 'SETTINGS.STATIC_PAGES.TERM_OF_SERVICE'
      }, {
        value : 1,
        label : 'SETTINGS.STATIC_PAGES.PRIVACY_POLICY'
      }, 
//      {
//        value : 2,
//        label : 'SETTINGS.STATIC_PAGES.TERM_OF_USE'
//      } 
    ]
    };

    for (var i = 0; i < $scope.properties.pages.length; i++) {
      tasks.push(API.call({
        token : token,
        api : 'get_static_page',
        page_type : $scope.properties.pages[i].value
      }));

      $scope.properties.push
    }

    $q.all(tasks).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        $scope.properties.pages[i].html = response[i];
        $scope.properties.pages[i].backup = response[i];
      }
    }, function(code) {
      Dialog.error(code);
    });

    $scope.save = function(page) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('SETTINGS.STATIC_PAGES.CONFIRM_SAVE_PAGE')
      }).then(function(answer) {
        if (answer) {
          API.call({
            token : token,
            api : 'upd_static_page',
            page_type : page.value,
            page_cnt : page.html
          }).then(function() {
            // store backup
            page.backup = page.html;
            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('SETTINGS.STATIC_PAGES.INFORM_SAVE_SUCCESSFULLY')
            });
          }, function(code) {
            Dialog.error(code);
          });
        }
      });
    };

    $scope.reset = function(page) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('SETTINGS.STATIC_PAGES.CONFIRM_RESET_PAGE')
      }).then(function(answer) {
        page.html = page.backup;
      })

    };

  };

  StaticPageCtrl.$inject = [ '$scope', '$q', '$translate', 'Session', 'API', 'Dialog' ];

  $app.controllers.controller('StaticPageCtrl', StaticPageCtrl);
})();