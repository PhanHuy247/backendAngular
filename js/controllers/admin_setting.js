(function() {
  var AdminSettingCtrl = function($scope, $translate, Session, API, Dialog, CSV) {
	var token = Session.getAuthority().token;
	$scope.admin = {};
	
	var reqDataGetAdminSetting = {
      api: 'get_admin_setting',
      token: token
    };

    API.call(reqDataGetAdminSetting).then(function(res) {
	  $scope.admin.timezone = Date.timezone();
	  
	  if (isSet(res)) {
		$scope.admin.timezone = res.time_zone;
	  }
    }, function(errorCode) {
      Dialog.error(errorCode);
    });
	
	$scope.adminSetting = function () {
	  API.call({
		api : 'set_admin_setting',
		token : token,
		time_zone : $scope.admin.timezone
	  }).then(function() {
		Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.ADMIN.MES_TIME_ZONE_SUCCESS')
        }).then(function() {
		  $app.timezone = $scope.admin.timezone;
		});
	  }, function(errorCode) {
		Dialog.error(errorCode);
	  });
	};
  };
  
  AdminSettingCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog', 'CSV'];
  $app.controllers.controller('AdminSettingCtrl', AdminSettingCtrl);
}) ();

