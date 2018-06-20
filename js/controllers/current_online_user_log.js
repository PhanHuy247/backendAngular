(function() {
  var CurrentOnlineUserLogCtrl = function($scope, $translate, $modal, Session, API, Dialog) {
    var token = Session.getAuthority().token;

    $scope.properties = {
      total : 0,
      male : 0,
      female : 0,
      video_call : 0,
      voice_call : 0,
      currentPage : 1,
      pageSize : $app.pageSize,
      pageDisplay : $app.pageDisplay,
      userTypes : $app.labels.get('userTypes', true),
      userCall : $app.labels.get('userCall', true)
    };

    $scope.load = function(page) {
      API.call({
        api : 'get_user_onl',
        token : token,
        skip : $scope.properties.pageSize * (page - 1),
        take : $scope.properties.pageSize
      }).then(function(response) {
        $scope.properties.total = response.total;
        $scope.properties.female = response.female;
        $scope.properties.male = response.male;
        $scope.properties.video_call = response.video_call;
        $scope.properties.voice_call = response.voice_call;
        $scope.users = response.list;
      }, function(code) {
        Dialog.error(code);
      });
    };

    $scope.beginLoad = function() {
      $scope.properties.currentPage = 1;
      $scope.load($scope.properties.currentPage);
    };

    $scope.beginLoad();
    
    /*$scope.userDetail = function(userId) {
      $modal.open({
        templateUrl : 'partials/common/dialog_user_detail.html',
        controller : $app.UserDetailCtrl,
        windowClass : 'user-detail-modal',
        resolve : {
          userId : function() {
            return userId;
          }
        }
      });
    };*/
  };

  CurrentOnlineUserLogCtrl.$inject = [ '$scope', '$translate', '$modal', 'Session', 'API', 'Dialog' ];
  $app.controllers.controller('CurrentOnlineUserLogCtrl', CurrentOnlineUserLogCtrl);
})();