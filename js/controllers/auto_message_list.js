(function() {

  var AutoMessageListCtrl = function($scope, $q, $location, $translate, $modal, API, Session, Dialog) {
    $scope.properties = {
      messageTypes : new Array,
      pageSize : $app.pageSize,
      currentPage : 1,
      pageDisplay : $app.pageDisplay,
      total : 0
    };

    var token = Session.getAuthority().token;

    API.call({
      token : token,
      api : 'get_sys_acc'
    }).then(function(response) {
      $scope.properties.messageTypes = response;
    }, function(errorCode) {
      Dialog.error(errorCode).then(function() {
        $location.path('/');
      });
    });

    $scope.load = function(page) {
      API.call({
        token : token,
        api : 'list_auto_mess',
        skip : $scope.properties.pageSize * (page - 1),
        take : $scope.properties.pageSize
      }).then(function(response) {
        $("html, body").animate({
          scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.properties.total = response.total;
        for (var i = 0; i < response.list.length; i++) {
          response.list[i].localTime = LocalTime.from(response.list[i].time, true);
          response.list[i].isEditMode = false;
          response.list[i].canEdit = response.list[i].localTime.time.getTime() > Date.now().getTime();
        }

        $scope.messages = response.list;
      }, function(errorCode) {
        Dialog.error(errorCode);
      });
    };

    $scope.load(1);

    $scope.edit = function(item) {
      item.isEditMode = true;
      item.$clone = angular.copy(item);
    };

    $scope.cancel = function(item) {
      var clone = item.$clone;
      delete item.$clone;
      for ( var key in clone) {
        item[key] = clone[key];
      }

      item.isEditMode = false;
      item.showError = {};
    };

    $scope.remove = function(item) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('USER.USER_AUTO_MESSAGE.CONFIRM_DELETE_MESSAGE')
      }).then(function(result) {
        if (result) {
          API.call({
            api : 'del_auto_mess',
            token : token,
            id : item.id
          }).then(function() {
            var offset = $scope.messages.length === 1 ? 1 : 0;
            var page = $scope.properties.currentPage - offset;

            $scope.properties.currentPage = page < 1 ? 1 : page;

            $scope.load($scope.properties.currentPage);
          }, function(errorCode) {
            Dialog.error(errorCode);
          });
        }
      });
    };

    $scope.save = function(item) {
      API.call({
        api : 'upd_auto_mess',
        token : token,
        id : item.id,
        sender : item.sender,
        content : item.content,
        time : item.localTime.toString(LocalTime.formats.yyyyMMddHHmm)
      }).then(function() {
        item.isEditMode = false;
        delete item.$clone;
        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('USER.USER_AUTO_MESSAGE.MESS_UPDATE_CONTENT')
        }).then(function() {
          item.showError = {};
        });
      }, function(errorCode) {
        errorProcess($translate, Dialog, errorCode, item);
      });
    };
    // Detail info: Receivers mssg
    $scope.infoDialog = function(item) {
      $modal.open({
        templateUrl : 'partials/receivers_dialog.html',
        controller : InfoDialogCtrl,
        resolve : {
          services : function() {
            return {
              API : API,
              Dialog : Dialog,
              $translate : $translate,
              Session : Session
            };
          },
          item : function() {
            return item;
          }
        }
      });
    };
  };
  var messageDataHandle = {
    4 : {
      control : '#messageType',
      name : 'messageType',
      message : 'USER.USER_AUTO_NOTIFICATION.MESS_ERR_TITLE'
    },
    5 : {
      control : '#content',
      name : 'content',
      message : 'USER.USER_AUTO_MESSAGE.MESS_UPDATE_CONTENT_ERROR'
    },
    6 : {
      control : '#time',
      name : 'time',
      message : 'USER.USER_AUTO_MESSAGE.MESS_UPDATE_TIME_ERROR'
    }
  };
  
  var errorProcess = function(translate, Dialog, errorCode, item) {
    var data = messageDataHandle[errorCode];
    item.showError = {};
    
    if (isSet(data)) {
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate(data.message)
      }).then(function() {
        item.showError[data.name] = true;
        $(data.control + item.id).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };

  var InfoDialogCtrl = function($scope, $modal, $modalInstance, services, item) {
    var token = services.Session.getAuthority().token;
    $scope.attributes = {
      userTypes: $app.labels.get('userTypes')
    };
    
    var nameDialog = services.$translate('DIALOG.ERROR_TITLE');
    
    $scope.title = services.$translate('USER.USER_AUTO_NOTIFICATION.RECEIVERS_TITLE', {nameDialog: nameDialog});

    $scope.properties = {
      pageSize : $app.pageSize,
      currentPage : 1,
      pageDisplay : $app.pageDisplay,
      total : 0
    };

    $scope.load = function(page) {
      var reqData = {
        api: 'get_receivers_auto_message',
        token: token,
        id: item.id,
        skip : $scope.properties.pageSize * (page - 1),
        take : $scope.properties.pageSize
      };
      services.API.call(reqData).then(function(res) {
        $("html, body").animate({
          scrollTop: $("#block-center-screen").position().top
        }, 1000);
        $scope.properties.total = res.total;
        $scope.receiversList = res.list;
      }, function(errorCode) {
        services.Dialog.error(errorCode);
      });
    };

    $scope.load(1);

    $scope.Ok = function() {
      $modalInstance.close();
    };
    
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
  
  /* create controller AutoMessageListCtrl */
  AutoMessageListCtrl.$inject = [ '$scope', '$q', '$location', '$translate', '$modal', 'API', 'Session', 'Dialog' ];
  $app.controllers.controller('AutoMessageListCtrl', AutoMessageListCtrl);

})();