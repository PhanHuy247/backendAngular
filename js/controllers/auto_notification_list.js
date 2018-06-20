(function() {

  var AutoNotificationListCtrl = function($scope, $q, $location, $translate, $modal, API, Session, Dialog) {
    $scope.properties = {
      pageSize : $app.pageSize,
      currentPage : 1,
      pageDisplay : $app.pageDisplay,
      total : 0
    };

    var token = Session.getAuthority().token;

    $scope.load = function(page) {
      API.call({
        token : token,
        api : 'list_auto_push',
        skip : $scope.properties.pageSize * (page - 1),
        take : $scope.properties.pageSize
      }).then(function(response) {
        console.log('======= dl trả về khi load data =============');
        console.log(response);
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
            api : 'del_auto_push',
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
        api : 'upd_auto_push',
        token : token,
        id : item.id,
        url : item.url,
        content : item.content.replace(/^\s+|\s+$/g, ""),
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

    // Detail info: Receivers Notification
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
    // Detail info
    $scope.infoDetail = function(item) {
      $modal.open({
        templateUrl : 'partials/notification_detail_dialog.html',
        controller : infoDetailCtrl,
        windowClass : 'user-detail-modal',
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
      control : '#url',
      name : 'url',
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
        api: 'get_receivers_auto_notify',
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
  };
  var infoDetailCtrl = function($scope, $filter, $modal, $modalInstance, services, item) {
    var token = services.Session.getAuthority().token;
    var job = [{
              value : 0,
              label : 'Học sinh'
              }, {
                value : 1,
                label : 'OL'
              }, {
                value : 2,
                label : 'Làm thêm'
              }, {
                value : 3,
                label : 'Bán thời gian'
              }, {
                value : 4,
                label : 'Y tá'
              }, {
                value : 5,
                label : 'Trông trẻ'
              }, {
                value : 6,
                label : 'Nhân viên bán hàng'
              }, {
                value : 7,
                label : 'Người mẫu'
              }, {
                value : 8,
                label : 'Giáo viên'
              }, {
                value : 9,
                label : 'Giúp việc'
              }, {
                value : 10,
                label : 'Nội trợ'
              }, {
                value : 11,
                label : 'Ăn uống'
              }, {
                value : 12,
                label : 'Trang phục'
              }, {
                value : 13,
                label : 'Thẩm mỹ'
              }, {
                value : 14,
                label : 'Tiếp viên'
              }, {
                value : 15,
                label : 'Bí mật'
              }, {
                value : 16,
                label : 'Khác'
              }, {
                value : 17,
                label : 'Nhân viên công ty'
              }, {
                value : 18,
                label : 'Người quản lý'
              }, {
                value : 19,
                label : 'Quản lý cấp cao'
              }, {
                value : 20,
                label : 'Bán thời gian'
              }, {
                value : 21,
                label : 'Học sinh'
              }, {
                value : 22,
                label : 'Kỹ sư'
              }, {
                value : 23,
                label : 'Xây dựng'
              }, {
                value : 24,
                label : 'Vận tải'
              }, {
                value : 25,
                label : 'Tài chính'
              }, {
                value : 26,
                label : 'Bất động sản'
              }, {
                value : 27,
                label : 'Phát luật'
              }, {
                value : 28,
                label : 'IT'
              }, {
                value : 29,
                label : 'Y tế'
              }, {
                value : 30,
                label : 'Giáo dục'
              }, {
                value : 31,
                label : 'Phúc lợi'
              }, {
                value : 32,
                label : 'Trang phục'
              }, {
                value : 33,
                label : 'Truyền thông'
              }, {
                value : 34,
                label : 'Nghệ thuật'
              }, {
                value : 35,
                label : 'Khác'
              }, {
                value : 36,
                label : 'Bí mật'
              }];
    var getJob = function($sex) {
      $sex = parseIntNullable($sex);
      var confJob = {
        1 : [0,16],
        0 : [17,36]
      };
      var min = confJob[0][0];
      var max = confJob[0][1];
      var result = [];
      if($sex !== 0 && $sex !== 1) {
        min = 0; max = 36;
      }else {
        min = confJob[$sex][0]; max = confJob[$sex][1];
      }
      for(var i=0; i < job.length; i ++) {
        if(job[i].value >= min && job[i].value <= max) {
          result.push(job[i]);
        }
      }
      return result;
    };

  $scope.property = {
      user_type : $app.labels.get('userTypes', true),
      is_purchase : $app.labels.get('isPurchase'),
      gender : $app.labels.get('genders', true),
      deviceType : $app.labels.get('deviceType',true),
      job : getJob(),
      region : $app.labels.get('region'),
      flags : $app.labels.get('userStatuses', true),
      cm_code : new Array,
      cup : $app.labels.get('cup'),
      cute_type : $app.labels.get('cuteType'),
      join_hours : $app.labels.get('joinHours'),
    };
    var dateFomat = function(date){
      var newDate = LocalTime.from(date).time;
      var datere = new Date(newDate);
      return datere;
    }
    var getCmCode = function(cm_code) {
      var cmCodeList = [];
      angular.forEach(cm_code, function(value, key) {
        angular.forEach($scope.property.cm_code, function(obj, item) {
          if (value == obj.label) {
            cmCodeList.push(item);
          }
        });
      });
      return cmCodeList;
    }
    var reqData = {
        api: 'get_auto_notify_detail',
        token: token,
        id: item.id
    };
    services.API.call(reqData).then(function(res) {
      $scope.data = res;
      var reqCmCode = {
      api : 'get_all_cm_code',
      token : token,
    }
    services.API.call(reqCmCode).then(function(data) {
      angular.forEach(data, function(value, key) {
        $scope.property.cm_code[key] = {value: key, label: value};
        $scope.query.cm_code = getCmCode($scope.data.query.cm_code);
      });
    }, function(errorCode) {
      Dialog.error(errorCode);
    });
      $scope.query = {
        is_purchase : angular.isDefined($scope.data.query.is_purchase) ? $scope.data.query.is_purchase : 2,
        from_reg_day : angular.isDefined($scope.data.query.from_reg_day) ? dateFomat($scope.data.query.from_reg_day) : null,
        to_reg_day : angular.isDefined($scope.data.query.to_reg_day) ? dateFomat($scope.data.query.to_reg_day) : null,
        last_from_pur_day : angular.isDefined($scope.data.query.last_from_pur_day) ? dateFomat($scope.data.query.last_from_pur_day) : null,
        last_to_pur_day : angular.isDefined($scope.data.query.last_to_pur_day) ? dateFomat($scope.data.query.last_to_pur_day) : null,
        from_login_day : angular.isDefined($scope.data.query.from_login_day) ? dateFomat($scope.data.query.from_login_day) : null,
        to_login_day : angular.isDefined($scope.data.query.to_login_day) ? dateFomat($scope.data.query.to_login_day) : null,
        lower_bir : angular.isDefined($scope.data.query.lower_bir) ? dateFomat($scope.data.query.lower_bir) : null,
        upper_bir : angular.isDefined($scope.data.query.upper_bir) ? dateFomat($scope.data.query.upper_bir) : null,
        from_pur_day : angular.isDefined($scope.data.query.from_pur_day) ? dateFomat($scope.data.query.from_pur_day) : null,
        to_pur_day : angular.isDefined($scope.data.query.to_pur_day) ? dateFomat($scope.data.query.to_pur_day) : null,
      };

    }, function(errorCode) {
      services.Dialog.error(errorCode);
    });

    $scope.Ok = function() {
      $modalInstance.close();
    };

    // Detail info
    $scope.infoDialog = function(item) {
      $modal.open({
        templateUrl : 'partials/receivers_dialog.html',
        controller : InfoDialogCtrl,
        resolve : {
          services : function() {
            return {
              API : services.API,
              Dialog : services.Dialog,
              $translate : services.$translate,
              Session : services.Session
            };
          },
          item : function() {
            return item;
          }
        }
      });
    };

  };
  /* create controller AutoNotificationListCtrl */
  AutoNotificationListCtrl.$inject = [ '$scope', '$q', '$location', '$translate', '$modal', 'API', 'Session', 'Dialog' ];
  $app.controllers.controller('AutoNotificationListCtrl', AutoNotificationListCtrl);

})();
