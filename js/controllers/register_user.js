(function() {
var RegisterUserCtrl = function($scope, $translate, $modal, $filter, API, Session, Dialog) { 
  var job = $app.labels.get('job', true);
  var token = Session.getAuthority().token;
  var getJob = function($sex) {
    $sex = parseIntNullable($sex);
    var confJob = {
      1 : [0,16],
      0 : [17,38]
    };
    var min = confJob[0][0];
    var max = confJob[0][1];
    var result = [];
    if ($sex === 0) {
      result.push(job[0]);
    }
    if($sex !== 0 && $sex !== 1) {
      min = 0; max = 38;
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

  // add body_type
  var body_type = $app.labels.get('body_type',true);
  // console.log($app.labels);
  var bodyTypes = function($sex) { 

    $sex = parseIntNullable($sex);
 //   $sex = parseIntNullable($scope.user.gender);
    var confBodyType = {
      1 : [0,7], //female
      0 : [8,15] //male
    };
    var min = confBodyType[0][0];
    var max = confBodyType[0][1];

    var result = [];
    if ($sex === 0) {
      result.push(body_type[0]);
    }
    if($sex !== 0 && $sex !== 1) {
      min = 0; max = 15;
    }else {
      min = confBodyType[$sex][0]; max = confBodyType[$sex][1];
    }
    for(var i=0; i < body_type.length; i ++) {
      if(body_type[i].value >= min && body_type[i].value <= max) {
        result.push(body_type[i]);
      }
    }
    return result;
  };
  //console.log(bodyTypes(0));

  $scope.properties = {
    user_type: $app.labels.get('userTypes', false), 
    flags: $app.labels.get('userStatuses'),
    gender: $app.labels.get('genders'),
    region: $app.labels.get('region', true),
    cup: $app.labels.get('cup'),
    cute_type: $app.labels.get('cuteType'),
    join_hours: $app.labels.get('joinHours'),
    job: getJob(0),
    verification_flag: $app.labels.get('verificationFlag'),
    video_call_waiting: $app.labels.get('videoCallWaiting'),
    voice_call_waiting: $app.labels.get('videoCallWaiting'),
    body_type: bodyTypes(0),
    //#11854
    hobby:$app.labels.get('hobby'),
  };
  console.log($scope.properties);
  $scope.user = {
    measurements: new Array,
    region : $scope.properties.region[0].value,
    job : $scope.properties.job[0].value,
    user_type : $scope.properties.user_type[0].value,
    gender : $scope.properties.gender[0].value,
    localBirthday : null,
    body_type : $scope.properties.body_type[0].value,
    hobby: new Array,
  };
  $scope.$watch(function() {
      return $scope.user['gender'];
    }, function(newValue) {
      $scope.properties['job'] = getJob(newValue);
      $scope.user.job = $scope.properties.job[0].value;
      // add body_type
      $scope.properties['body_type'] = bodyTypes(newValue);
      $scope.user.body_type = $scope.properties.body_type[0].value;
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
  $scope.check = function(gender) {
  $scope.setRequire = new Array;
  for (var key in $scope.user) {
    $scope.setRequire[key] = true;
  }
  $scope.setRequire['job'] = false;
  $scope.setRequire['body_type'] = false;

  /* if (gender == "0") {//Male
    $scope.setRequire['hobby'] = false;
  } */
  if (gender == "1") {
    $scope.setRequire['cup'] = false;
    $scope.setRequire['join_hours'] = false;
    $scope.setRequire['measurements'] = false;
    $scope.setRequire['type_of_man'] = false;
    $scope.setRequire['fetish'] = false;
    $scope.setRequire['abt'] = false;
  }
  };

  $scope.checkHasError = function() {
    $scope.error = {};
    var flags_err = false;
    $scope.check($scope.user.gender);
    for (var key in $scope.user) {
      if ($scope.setRequire[key] && ($scope.user[key] === "")) {
        $scope.error[key] = true;
        flags_err = true;
      }
    }
    if (isUnset($scope.user.user_name)) {
      $scope.error['user_name'] = true;
      flags_err = true;
    }
    return flags_err;
  };
  /*
  * checkHasError
  * @param {type} $scope.error
  * @returns {true,false}
  */
  var messageDataHandle = {
    15: {
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

  $scope.register = function() {
    if($scope.checkHasError()) {
      return;
    }
    var selectUserType = {
      0 : "email",
      1 : "fb_id",
      2 : "mocom_id",
      3 : "famu_id"
    };

    var params = {
      api: 'register_by_admin',
      token: token,
      user_name: $scope.user.user_name,
      bir: $scope.user.localBirthday.time.local(LocalTime.formats.yyyyMMdd),
      region: parseIntNullable($scope.user.region),
      gender: $scope.user.gender,
      job: $scope.user.job === '' ? null : parseIntNullable($scope.user.job),
      body_type: $scope.user.body_type === '' ? null : parseIntNullable($scope.user.body_type),
      abt: $scope.user.abt,
      phone_number: $scope.user.phone_number,
    };

    params[selectUserType[$scope.user.user_type]] = $scope.user[selectUserType[$scope.user.user_type]];
    if ($scope.user.user_type == 0 ) {
      params.original_pwd =  $scope.user.original_pwd.toString().length === 0  ? undefined : $scope.user.original_pwd.toString();
      params.pwd =  $scope.user.original_pwd.toString().length === 0  ? undefined : SHA1($scope.user.original_pwd)
    }

    if ($scope.user.gender == 1) {
      params.cup = $scope.user.cup;
      params.join_hours = $scope.user.join_hours;
      params.measurements = $scope.user.measurements;
      params.type_of_man = $scope.user.type_of_man;
      params.fetish = $scope.user.fetish;
      params.cute_type = $scope.user.cute_type;
    }

    //#11854
    var newArrhobby = [];
    angular.forEach($scope.properties.hobby, function (value, key) {
      angular.forEach($scope.user.hobby, function (valueSelected, keySelected) {
        if(value.value == valueSelected ){
          newArrhobby.push(value.label);
          params.hobby = newArrhobby;;
        }
      });
    });
    // console.log('====== dl gửi lên của dki user ==============');
    // console.log(params);
    API.call(params).then(function() {
      Dialog.alert({
        title: $translate('DIALOG.INFO_TITLE'),
        message: $translate('SETTINGS.USER_REGISTER.MESSAGE_SUCCESS')
      });
      $scope.user.showError = {};
     }, function(errorCode) {
      errorProcess($translate, Dialog, errorCode, $scope.user);
      });
    };
};

RegisterUserCtrl.$inject = [ '$scope', '$translate', '$modal', '$filter', 'API', 'Session', 'Dialog' ];

$app.controllers.controller('RegisterUserCtrl', RegisterUserCtrl);
})();
