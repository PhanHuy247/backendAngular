(function () {
    var SearchUserCtrl = function ($scope, $location, $q, $routeParams, $modal, $translate, API, Dialog, Session) {
        $scope.searchUserID = function () {
            window.location.href = "#/user/user_detail/" + jQuery("#input-user-id").val().trim();
        };
    };

    SearchUserCtrl.$inject = ['$scope', '$location', '$q', '$routeParams', '$modal', '$translate', 'API', 'Dialog', 'Session'];
    $app.controllers.controller('SearchUserCtrl', SearchUserCtrl);
})();