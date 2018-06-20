(function () {
    var MenuCtrl = function ($scope, Menu, Messenger) {
        $scope.menu = new Array;
        $scope.$on('auth_succeed', function () {
            var menu = Menu.query(Messenger.inbox());

            // trim menu, remove empty object
            for (var i = 0; i < menu.groups.length; i++) {
                if (isUnset(menu.groups[i])) {
                    menu.groups.splice(i, 1);
                    i--;
                }
            }

            $scope.menu = menu;
        });

        $scope.redirectUrl = function (itemMenu) {
            var urlOnMenu = itemMenu.currentTarget.getAttribute("href").toString();
            var urlCurrentOnPage = "#" + window.location.href.split("#")[1].toString();
            if (urlOnMenu === urlCurrentOnPage) {
                location.reload(); // Reload page if current. Default switch page
            }
        };

    };
    MenuCtrl.$inject = ['$scope', 'Menu', 'Messenger'];

    $app.controllers.controller('MenuCtrl', MenuCtrl);
})();