// User detail
$app.UserDetailCtrl = function($scope, $q, $injector, $modal, $modalInstance, $translate, API, Dialog, Session, userId) {
  $injector.invoke($app.BaseModalCtrl, this, {
    $scope: $scope,
    $q: $q,
    API: API
  });
  var job = $app.labels.get('job');

  $scope.getJob = function($sex, $job) {

//    $sex = parseIntNullable($sex);
    $sex = parseIntNullable($scope.user.gender);
    var confJob = {
      0: [0, 16],
      1: [17, 36]
    };
    var min = confJob[0][0];
    var max = confJob[0][1];
    
    if($job !== -1 && $job !== "" && $job !== null ) {
        var result = [];
    }else {
        var result = [{
            value : -1,
            label : $translate('FORM.ASK_ME')
        }];
    }

    if ($sex !== 0 && $sex !== 1) {
      min = 0;
      max = 36;
    } else {
      min = confJob[$sex][0];
      max = confJob[$sex][1];
    }
    for (var i = 0; i < job.length; i++) {
      if (job[i].value >= min && job[i].value <= max) {
        result.push(job[i]);
      }
    }
    $scope.properties.job = result;
    return result;
  };

  $scope.is_show_field_when_is_female = false;
  $scope.properties = {
    user_type: $app.labels.get('userTypes'),
    flags: $app.labels.get('userStatuses'),
    gender: $app.labels.get('genders'),
    region: $app.labels.get('region', true),
    cup: $app.labels.get('cup'),
    cute_type: $app.labels.get('cuteType'),
    join_hours: $app.labels.get('joinHours'),
    job: job,
    verification_flag: $app.labels.get('verificationFlag'),
    video_call_waiting: $app.labels.get('videoCallWaiting'),
    voice_call_waiting: $app.labels.get('videoCallWaiting')
  };


  $scope.divwrap = '#main-body';

  $scope.user = {
    measurements: new Array,
    region : $scope.properties.region[0].value,
    job : $scope.properties.job[0].value
  };
  var token = Session.getAuthority().token;
  $scope.callAPI({
    api: 'detail_user',
    token: token,
    id: userId
  }).then(function(data) {
    $scope.properties['job'] = $scope.getJob(data.gender, data.job);
    if(data.gender === 1 && data.finish_register_flag === 1) {        
        $scope.properties['region'] = $scope.user.region !== null ? $app.labels.get('region') : $app.labels.get('region', true);
    }
    for(var key in data) {
        $scope.user[key] = data[key];
    }
    //If user_type = 0 || 1 then server return all : email, fb_id => need to refactor.
    $scope.user.fb_id =  $scope.user.email;
	$scope.user.mocom_id =  $scope.user.email;
	$scope.user.famu_id =  $scope.user.email;
    
    //$scope.user = data;
    $scope.firstUser = angular.copy($scope.user);
    $scope.is_show_field_when_is_female = $scope.user.gender == "1" ? true : false;
    $scope.user.localBirthday = LocalTime.from($scope.user.bir, true);
    if($scope.user.ava_id && $scope.user.ava_id !== null) {
	$scope.user.$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
            + '&img_id='+ $scope.user.ava_id  +'&img_kind=2';
    }    
    $scope.check($scope.user.gender, $scope.user.finish_register_flag);
    $scope.checkRequire();
  }, function(errorCode) {
    Dialog.error(errorCode);
  });

  $scope.check_full_three_value = function() {
    var configMeasurements = [40, 30, 30]   //[minBust,minWaist,minHips]
    if ($scope.user['measurements'].length < 3 && $scope.user['measurements'].length >= 1) {
      for (var i = 0; i < 3; i++) {
        if ($scope.user['measurements'][i] == null || $scope.user['measurements'][i] == "") {
          $scope.user['measurements'][i] = configMeasurements[i];
        }
      }
    }
  };


  $scope.update = function() {
    var has_error = 0;
	var selectUserType = {
	  0 : "email",
	  1 : "fb_id",
	  2 : "mocom_id",
	  3 : "famu_id"
	};

    //(key : value) : key : key is key of params (server return this key : params[key]), value : is key of scope.user[value]
    var check_change_to_null = {
      fetish: 'fetish',
      memo: 'memo',
      type_of_man: 'type_of_man',
      hobby: 'hobby'
    };
    var params = {
      api: 'upd_user_inf_by_admin',
      token: token,
      req_user_id: userId,
      user_name: $scope.user.user_name,
      abt: $scope.user.abt,
      del_abt: $scope.user.abt === '' ? 1 : 0,
      bir: $scope.user.localBirthday.time.local(LocalTime.formats.yyyyMMdd),
      gender: $scope.user.gender,
      flag: parseIntNullable($scope.user.flag),
      region: parseIntNullable($scope.user.region),
      cup: parseIntNullable($scope.user.cup),
      cute_type: parseIntNullable($scope.user.cute_type),
      join_hours: parseIntNullable($scope.user.join_hours),
      job: $scope.user.job === '' ? null : parseIntNullable($scope.user.job) ,
//      indecent: parseIntNullable($scope.user.indecent),
      memo: $scope.user.memo,
      fetish: $scope.user.fetish,
      type_of_man: $scope.user.type_of_man,
      measurements: $scope.user.measurements,
      hobby: $scope.user.hobby,
      point: $scope.user.point,
      verification_flag: $scope.user.verification_flag,
      video_call_waiting: $scope.user.video_call_waiting,
      voice_call_waiting: $scope.user.voice_call_waiting
    };
    
    //Check User_type is email(0) or facebook (1)
    /* old
	if ($scope.user.user_type === 0) {
	  params.email = $scope.user.email;
    } else if ($scope.user.user_type === 1) {
	  params.fb_id = $scope.user.fb_id;
    } else if ($scope.user.user_type === 2) {
	  params.mocom_id = $scope.user.mocom_id;
	} else {
	  params.famu_id = $scope.user.famu_id;
	}*/
	params[selectUserType[$scope.user.user_type]] = $scope.user[selectUserType[$scope.user.user_type]];
    
    if ($scope.is_show_field_when_is_female === false) {
      params.cup = null;
//      params.cute_type = null;
      params.join_hours = null;
//      params.indecent = null;
      params.measurements = null;
    }

    /*
     * Check mesurements is null
     */
    if(params.measurements && params.measurements[0] === null && params.measurements[1] === null && params.measurements[2] === null) {
	params.measurements = null;
    }
    for (var key in check_change_to_null) {
      if ($scope.firstUser[key]) {
        if ($scope.firstUser[key] !== params[key] && (params[key] == "")) {
          params[key] = ' ';
        }
      }
    }

//    if($scope.user.finish_register_flag === 1 || $scope.user.finish_register_flag === "1") {
//      if($scope.user.user_name === null || $scope.user.region === null || $scope.user.region === 0 || $scope.user.region.length <= 0)  {
//        has_error++;
//      }
//    }
    $scope.checkRequire();
    if ($scope.checkHasError()) {
      has_error++;
    }

    if (has_error !== 0) {
      Dialog.alert({
        title: $translate('DIALOG.INFO_TITLE'),
        message: $translate('DIALOG.ERROR_TITLE')
      });
      return false;
    };
	
    $scope.callAPI(params).then(function() {
      Dialog.alert({
        title: $translate('DIALOG.INFO_TITLE'),
        message: $translate('USER.USER_DETAIL.MESS_UPDATEUSER_CONTENT')
      });
      $scope.user.showError = {};
    }, function(errorCode) {
      errorProcess($translate, Dialog, errorCode, $scope.user);
    });
  };

  $scope.viewPoint = function() {
    $modal.open({
      templateUrl: 'partials/user_point_history.html',
      controller: $app.PointHistoryModal,
      windowClass: 'window-class-style',
      resolve: {
        data: function() {
          return $scope.user;
        }
      }
    });
  };

  $scope.addPoint = function() {
    $modal.open({
      templateUrl: 'partials/add_point.html',
      controller: $app.AddPointModal,
      resolve: {
        data: function() {
          return $scope.user;
        }
      }
    }).result.then(function(amount) {
      // if (isSet(amount.untradableAmount) && !isNaN(amount.untradableAmount) && amount.untradableAmount !== 0) {
      //   $scope.user.untradable_point += parseInt(amount.untradableAmount, 10);

      //   if ($scope.user.untradable_point < 0) {
      //     $scope.user.untradable_point = 0;
      //   }
      // }
      // if (isSet(amount.tradableAmount) && !isNaN(amount.tradableAmount) && amount.tradableAmount !== 0) {
      //   $scope.user.tradable_point += parseInt(amount.tradableAmount, 10);

      //   if ($scope.user.tradable_point < 0) {
      //     $scope.user.tradable_point = 0;
      //   }
      // }
      if (isSet(amount) && !isNaN(amount) && amount !== 0) {
        $scope.user.point += parseInt(amount, 10);

        if ($scope.user.point < 0) {
          $scope.user.point = 0;
        }
      }
    });
  };

  $scope.resetPassword = function(userId) {

    $modal.open({
      templateUrl: 'partials/reset_password.html',
      controller: $app.ResetPassword,
      resolve: {
        data: function() {
          return $scope.user;
        }
      }
    }).result.then(function(password) {
      $scope.user.original_pwd = password;
    });
  };

  $scope.close = function() {
//    $('.dropdown-menu').hide();
    $modalInstance.close();
  };

  /*
   * Logical here
   */
  $scope.setRequire = {};
  $scope.error = {};
  $scope.$watch(function() {
    return $scope.user['gender'];
  }, function(newValue) {
//    $scope.properties['job'] = $scope.getJob(newValue);
    $scope.is_show_field_when_is_female = newValue == "1" ? true : false;
  });

  /*
   * 
   * @returns {undefined}
   * check all user and return error if has
   */
  $scope.checkRequire = function() {
    for (var key in $scope.user) {
      if ($scope.setRequire[key] && ($scope.user[key] === null)) {
        $scope.error[key] = true;
      } else {
        $scope.error[key] = false;
      }
    }
  };

  /*
   * checkHasError
   * @param {type} $scope.error
   * @returns {true,false}
   */
  $scope.checkHasError = function() {
    var totalError = 0;
    for (var key in $scope.error) {
      if ($scope.setRequire[key] && $scope.setRequire[key] == true && $scope.error[key] == true) {
        return true;
      }
    }
    return false;
  };
  /*
   * 53da4898e4b0967a41c39acd : gender : 0, finish_register_flag : 1
   53db3421e4b0967a41c39be9 : gender : 1, finish_register_flag : 1
   53db41bae4b0967a41c39c64 : gener : 1 : finish_register_flag : 0
   53db3ddce4b0967a41c39c36  : gender : 0; finish_register_flag : 0
   
   53dc515be4b035a9e7038340 : gender : 1 ; finish_register_flag : 0;
   53db80bfe4b035a9e70382e7 : gender : 1 ; finish_register_flag : 1
   53db7d17e4b035a9e703827e : gender : 0; finish_register_flag : 1;
   53da88a4e4b035a9e70378b0 : gender : 0; finish-register-flag : 0;
   */

  $scope.check = function(gender, finish_register_flag) {
    for (var key in $scope.user) {
      $scope.setRequire[key] = false;
    }
//    $scope.setRequire['mail'] = $scope.firstUser['mail'] !== null ? true : false;
    if (gender == "0" && finish_register_flag == 0) {//Male
      $scope.setRequire['region'] = false;
    } else if (gender == "0" && finish_register_flag == 1) {
      $scope.setRequire['user_name'] = true;
      $scope.setRequire['region'] = false;
    } else if (gender == "1" && finish_register_flag == 0) {//FeMale
      $scope.setRequire['user_name'] = false;
      $scope.setRequire['region'] = false;
      $scope.setRequire['job'] = false;
      $scope.setRequire['type_of_man'] = false;
      $scope.setRequire['fetish'] = false;
      $scope.setRequire['abt'] = false;
      $scope.setRequire['join_hours'] = false;
      $scope.setRequire['cup'] = false;
      $scope.setRequire['cute_type'] = false;
      $scope.setRequire['measurement'] = false;
//      $scope.setRequire['indecent'] = false;
    } else if (gender == "1" && finish_register_flag == 1) {
      //name , region is require ( not null )
      //text input  : allow update is empty.
      //other field : if orginal data  have value then this is not null.
      $scope.setRequire['user_name'] = true;
      $scope.setRequire['region'] = true;
      $scope.setRequire['job'] = $scope.firstUser['job'] !== null ? true : false;
      $scope.setRequire['type_of_man'] =  $scope.firstUser['type_of_man'] !== null ? true : false;
      $scope.setRequire['fetish'] = false;
      $scope.setRequire['abt'] = false;
      $scope.setRequire['join_hours'] = true;
      $scope.setRequire['cup'] = $scope.firstUser['cup'] !== null ? true : false;
      $scope.setRequire['cute_type'] = $scope.firstUser['cute_type'] !== null ? true : false;
      $scope.setRequire['measurement'] = true;
//      $scope.setRequire['indecent'] = true;
    }

  };
  /*
   * Logical : check purchase 
   */
  $scope.$watch(function() {
    return $scope.user['is_purchase'];
  }, function(newValue) {
    $scope.is_show_money_pur_day = newValue == "1" ? true : false;
  });

  /*
   * Logic Bussiness
   */


};

$app.UserDetailCtrl.$inject = ['$scope', '$q', '$injector', '$modal', '$modalInstance', '$translate', 'API', 'Dialog', 'Session', 'userId'];

$app.PointHistoryModal = function($scope, $q, $injector, $modal, $modalInstance, $translate, $sce, API, Session, Dialog, data) {
  $injector.invoke($app.BaseModalCtrl, this, {
    $scope: $scope,
    $q: $q,
    API: API
  });

  $scope.reasons = $app.labels.get('logReasons');
  $scope.user = data;
  $scope.close = function() {
    $modalInstance.close();
  };

  //Call api to get options of FREE POINT select
  API.call({
    api: 'lst_free_point',
    token: Session.getAuthority().token,
    skip: 0,
    take: 0
  }).then(function(response) {
    $scope.freePoints = response.list;
    API.call({
      api: 'lst_log_pnt',
      token: Session.getAuthority().token,
      id: $scope.user.user_id
    }).then(function(data) {
      for (var i in data.list) {
        data.list[i].isSetPartnerId = false;

        if (data.list[i].type === 41) {
          //if is add point free
          var logReasons = $scope.freePoints;
          for (var j in logReasons) {
            if (logReasons[j].free_point_number === data.list[i].free_point_type) {
              data.list[i].isSetPartnerId = true;
              data.list[i].type = $sce.trustAsHtml($translate('LOG.POINT.SELECT.ADD_FREE_POINT_FROM_XXX', {name: logReasons[j].free_point_name}));
            }
          }
        } else if (data.list[i].type === 42) {
          //if is add point free
          var saleTypes = $app.labels.get('saleType');
          for (var j in saleTypes) {
            if (saleTypes[j].value === data.list[i].sale_type) {
              data.list[i].isSetPartnerId = true;
              data.list[i].type = $sce.trustAsHtml($translate('LOG.POINT.SELECT.ADD_POINT_BY_XXX', {name: saleTypes[j].label}));
            }
          }
        } else {
          var html = '<a class="btn-link">' + data.list[i].partner_id + '</a>';
          var logReasons = $app.labels.get('logReasons');
          for (var j in logReasons) {
            if (logReasons[j].value === data.list[i].type && !isUnset(logReasons[j].name)) {
              data.list[i].isSetPartnerId = true;
              data.list[i].type = $sce.trustAsHtml($translate(logReasons[j].name, {name: html}));
            }
          }
        }


      }
      $scope.pointLog = data.list;
    }, function(errorCode) {
      Dialog.error(errorCode).then(function() {
        $scope.close();
      });
    });
  }, function(code) {
    Dialog.error(code);
  });


  $scope.userDetail = function(userId) {
    $modal.open({
      templateUrl: 'partials/common/dialog_user_detail.html',
      controller: $app.UserDetailCtrl,
      windowClass: 'user-detail-modal',
      resolve: {
        userId: function() {
          return userId;
        }
      }
    });
  };
};

$app.PointHistoryModal.$inject = ['$scope', '$q', '$injector', '$modal', '$modalInstance', '$translate', '$sce', 'API', 'Session', 'Dialog', 'data'];

$app.AddPointModal = function($scope, $q, $injector, $modalInstance, API, Session, Dialog, data) {
  $injector.invoke($app.BaseModalCtrl, this, {
    $scope: $scope,
    $q: $q,
    API: API
  });
  $scope.user = data;
  $scope.input = {
    untradable_amount: 0,
    tradable_amount: 0
  };
  $scope.close = function() {
    $modalInstance.close();
  };

  $scope.addPoint = function() {
    // var untradableAmount = parseIntNullable($scope.input.untradable_amount);
    // var tradableAmount = parseIntNullable($scope.input.tradable_amount);
    var amount = parseIntNullable($scope.input.amount);

    $scope.callAPI({
      api: 'add_point',
      token: Session.getAuthority().token,
      id: $scope.user.user_id,
      // untradable_point : untradableAmount,
      // tradable_point : tradableAmount
      point: amount
    }).then(function() {
      // var resultData = {
      //   untradableAmount : untradableAmount,
      //   tradableAmount : tradableAmount
      // };

      // $modalInstance.close(resultData);
      $modalInstance.close(amount);
    }, function(code) {
      Dialog.error(code);
    });
  };
};

$app.AddPointModal.$inject = ['$scope', '$q', '$injector', '$modalInstance', 'API', 'Session', 'Dialog', 'data'];

$app.ResetPassword = function($scope, $q, $injector, $modalInstance, $translate, API, Session, Dialog, data) {
  var userId = data.user_id;
  $injector.invoke($app.BaseModalCtrl, this, {
    $scope: $scope,
    $q: $q,
    API: API
  });
  var token = Session.getAuthority().token;
  $scope.input = {};

  $scope.changePassword = function() {
    if ($scope.input.newPassword !== $scope.input.confirmNewPassword) {
      Dialog.alert({
        title: $translate('DIALOG.WARNING_TITLE'),
        message: $translate('CHANGE_PASSWORD.PASSWORD_NOT_MATCHED')
      }).then(function() {
        $('#confirm').focus();
      });
    } else {
      var reqDataResetPassword = {
        api: 'reset_pwd',
        token: token,
        id: userId,
        original_pwd: isUnset($scope.input.newPassword) || $scope.input.newPassword.toString().length === 0 ? undefined : $scope.input.newPassword.toString(),
        pwd: isUnset($scope.input.newPassword) || $scope.input.newPassword.toString().length === 0 ? undefined : SHA1($scope.input.newPassword)
      };

      $scope.callAPI(reqDataResetPassword).then(function() {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('USER.USER_DETAIL.MESS_UPDATE_PASS')
        }).then(function() {
          $modalInstance.close($scope.input.newPassword);
        });
      }, function(errorCode) {
        errorProcess($translate, Dialog, errorCode, $scope.input);
      });
    }
  };




  $scope.close = function() {
    $modalInstance.close();
  };
};

$app.ResetPassword.$inject = ['$scope', '$q', '$injector', '$modalInstance', '$translate', 'API', 'Session', 'Dialog', 'data'];

var messageDataHandle = {
  4: {
    control: '#age',
    name: 'age',
    message: 'USER.USER_DETAIL.MESS_UPDATE_AGE_ERROR'
  },
  5: {
    control: '#height',
    name: 'height',
    message: 'USER.USER_DETAIL.MESS_UPDATE_HEIGHT_ERROR'
  },
  6: {
    control: '#userName',
    name: 'userName',
    message: 'USER.USER_DETAIL.MESS_UPD_USER_NAME_LENGTH_ERROR'
  },
  7: {
    control: '#about',
    name: 'about',
    message: 'USER.USER_DETAIL.MESS_UPD_ABOUT_LENGTH_ERROR'
  },
  11: {
	control: '#email',
    name: 'email',
    message: 'USER.USER_DETAIL.MESS_INVALID_EMAIL'
  },
  12: {
    control: '#email',
    name: 'email',
    message: 'USER.USER_DETAIL.MESS_UPDATE_EMAIL_ERROR'
  },
  14: {
    control: '#userName',
    name: 'userName',
    message: 'USER.USER_DETAIL.MESS_UPDATE_USER_NAME_ERROR'
  },
  21: {
    control: '#password',
    name: 'password',
    message: 'USER.USER_DETAIL.MESS_UPDATE_PASS_ERROR'
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
      $(data.control).focus();
    });
  } else {
    Dialog.error(errorCode);
  }
};

