(function () {
  // Update CM code
  var CmCodeUpdateCtrl = function($scope, $routeParams, $q, Session, API, Messenger, $location) {
    $scope.input = {};
    var cmCodeId = $routeParams.cmCodeId;
    var token = Session.getAuthority().token;
    var deferrer = $q.defer();
    
    $scope.input.isEdit = false;

    // get CM code detail by id
    var reqDataGetCmCodeDetail = {
      api: 'get_cm_code_detail',
      token: token,
      cm_code_id: cmCodeId
    };
    
    API.call(reqDataGetCmCodeDetail).then(function(cmCode) {
      $scope.aff_name = cmCode.aff_name;
      $scope.media_name = cmCode.media_name;
      $scope.cm_code = cmCode.cm_code;
      $scope.input.status = cmCode.flag;
      $scope.input.money = cmCode.money;
      $scope.input.type = cmCode.type;
      $scope.input.registration = cmCode.reg_url;
      $scope.input.purchase = cmCode.pur_url;
      $scope.input.description = cmCode.des;
    }, function(errorCode) {
      Messenger.send('show_dialog', {
        title: 'Error',
        type: 'alert',
        message: 'Error code: ' + errorCode
      });
    });
    
    $scope.UpdateCmCode = function () {
      var reqDataUpd = {
        api: 'upd_cm_code',
        token: token,
        cm_code_id: cmCodeId,
        flag: $scope.input.status,
        money: $scope.input.money,
        type: $scope.input.type,
        reg_url: $scope.input.registration,
        pur_url: $scope.input.purchase,
        des: $scope.input.description
      };
      
      API.call(reqDataUpd).then(function () {
        Messenger.send('show_dialog', {
          title: 'Success',
          type: 'alert',
          message: 'Update CM code successfully.',
          deferrer: deferrer
        });
        
        deferrer.promise.then(function () {
          $location.path('/advertise/cm_code_list');
        });
      }, function (errorCode) {
        Messenger.send('show_dialog', {
          title: 'Error',
          type: 'alert',
          message: 'Error code: ' + errorCode
        });
      });
      
    };
  };
  
  CmCodeUpdateCtrl.$inject = ['$scope', '$routeParams', '$q', 'Session', 'API', 'Messenger', '$location'];
  $app.controllers.controller('CmCodeUpdateCtrl', CmCodeUpdateCtrl);
}) ();