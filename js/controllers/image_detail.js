(function() {
  var ImageDetailCtrl = function($scope, $routeParams, $translate, $location, Session, API, Dialog) {
    var imageId = $routeParams.imageId;
    var userId = $routeParams.userId;
    var token = Session.getAuthority().token;
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes')
    };
    
    API.call({
      api : 'detail_user',
      token : token,
      id : userId
    }).then(function(response) {
      $scope.user = response;
    }, function(errorCode) {
      Dialog.error(errorCode);
    });
    
    $scope.imageUrl = $app.imageUrl + '/api=load_img_admin&token=' + 
      token + '&img_id=' + imageId + '&img_kind=1';
    
    // delete image
    $scope.deleteImage = function() {
      Dialog.confirm({
        title: $translate('DIALOG.CONFIRM_TITLE'),
        message: $translate('REPORT.IMAGE.CONFIRM_DELETE')
      }).then(function(result) {
        if (result) {
          API.call({
            api: 'del_image',
            token: token,
            img_id: imageId
          }).then(function() {
            Dialog.alert({
              title: $translate('DIALOG.INFO_TITLE'),
              message: $translate('REPORT.IMAGE.CONFIRM_DELETE_SUCCESS')
            }).then(function() {
              $location.path('/');
            });
          }, function(errorCode) {
            Dialog.error(errorCode);
          });
        }
      });
    };
  };
  
  ImageDetailCtrl.$inject = ['$scope', '$routeParams', '$translate', '$location', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('ImageDetailCtrl', ImageDetailCtrl);
})();