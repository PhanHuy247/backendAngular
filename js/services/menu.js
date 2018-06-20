(function() {
  var Menu = function($http, $q) {
    return {
      query : function(roleId) {
        var menu = {
          groups : new Array
        };

        for (var i = 0; i < $app.meta.scr_groups.length; i++) {
          if ($app.meta.scr_groups[i].roles.indexOf(roleId) > -1) {
            var group = {
              name : $app.meta.scr_groups[i].name,
              screens : new Array
            };

//            if($app.meta.scr_groups[i].name === 'LOG_MANAGEMENT' ) {
//                        var orderedMenu = new Array;
//                        console.log($app.meta.scr_groups[i].screens);
                        $app.meta.scr_groups[i].screens.sortByKey('order');
//                        console.log($app.meta.scr_groups[i].screens);
//            }
            for (var j = 0; j < $app.meta.scr_groups[i].screens.length; j++) {
              if($app.meta.scr_groups[i].screens[j].order >= 0) {
//                console.log($app.meta.scr_groups[i].screens[j].order);
                group.screens.push({
                  name : $app.meta.scr_groups[i].screens[j].name,
                  path : $app.meta.scr_groups[i].screens[j].path
                });
              }
            }
//            if($app.meta.scr_groups[i].name === 'LOG_MANAGEMENT' ) {
//              console.log($app.meta.scr_groups[i]);
//            console.log(group);
//          }

            menu.groups[$app.meta.scr_groups[i].order] = group;
          }
        }

        return menu;
      }
    };
  };

  Menu.$inject = [ '$http', '$q' ];

  $app.services.factory('Menu', Menu);
})();