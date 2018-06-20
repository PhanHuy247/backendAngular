(function () {
  // General setting controller
  var PointSettingCtrl = function ($scope, $translate, Session, API, Dialog) {
    $scope.input = {};
    $scope.inputBackUpPoint = {};
    $scope.orderedInput = {
     areasAddPoint : [
      {
        name : 'daily_bonus',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.DAILY_POINT_BONUS')
      },
      {
        name : 'invite_friend',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.INVITE_FRIEND')
      },
      {
        name : 'advertsement',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.ADVERTISEMENT')
      },
      {
        name : 'register',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.REGISTER')
      },
      {
        name : 'add_buzz_bonus',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_BUZZ_BONUS')
      },
      {
        name : 'add_looking_for',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_LOOKING_FOR')
      },
      {
        name : 'add_about_me',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_ABOUT_ME')
      },
      {
        name : 'add_avatar',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_AVATAR')
      },
      {
        name : 'add_relationship',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_RELATIONSHIP')
      },
      {
        name : 'add_body_type',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_BODY_TYPE')
      },
      {
        name : 'add_height',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_HEIGHT')
      },
      {
        name : 'add_ethnicity',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_ETHNICITY')
      },
      {
        name : 'add_interes',
        value : {},
        label : $translate('LOG.POINT.SELECT.ADD_INTERES')
      }
     ],
     areasMinusPoint : [
       {
        name : 'who_check_me_out',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.WHO_CHECKED_ME_OUT'),
        order: 1
       },
       {
         name : 'wink_bomb',
         value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.WINK_BOMB'),
        order: 2
       },
       {
         name : 'online_alert',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.ONLINE_ALERT'),
        order: 3
       },
       {
         name : 'who_favorited_me',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.FAVORITE_ME'),
        order: 4
       },
       {
         name : 'receive_gift',
         value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.GIVE_GIFT'),
        order: 5
       },
       {
         name : 'unlock_backstage_bonus',
         value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.UNLOCK_BACKSTAGE_BONUS'),
        order: 6
       }
     ],
     areasAddMinusPoint : [
      {
        name : 'wink',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.WINK')
      },
      {
        name : 'view_image',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.VIEW_IMAGE_WHITE_CHATTING')
      },
      {
        name : 'send_sticker',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.SEND_STAMP')
      },
      {
        name : 'save_image',
        value : {},
        label : $translate('SETTINGS.GENERAL.POINT_SETTING.SAVE_IMAGE')
      }
     ]
    };
    $scope.distance = {}; 
    $scope.distanceBackUp = {};
    $scope.other = {};
    $scope.otherBackUp = {};
    $scope.chat = {};
    $scope.chatBackUp = {};
    
    var token = Session.getAuthority().token;
    
    // get point
    API.call({
      api: 'get_general_setting',
      token: token,
      type: 1
    }).then(function (pntdata) {
      // fill data for every input control
      for (var key in pntdata) {
        $scope.input[key] = pntdata[key];
        for(var area in $scope.orderedInput) {
          for(var i = 0; i < $scope.orderedInput[area].length; i++ ) {
            if($scope.orderedInput[area][i].name === key) {
              $scope.orderedInput[area][i].value = pntdata[key];
            }
          }
          
        }
      }      
      // back up input
      $scope.inputBackUpPoint = angular.copy($scope.input);
    }, function (errorCode) {
      Dialog.error(errorCode);
    }); // End get point
    
    
//    // Get distance
//    API.call({
//      api: 'get_general_setting',
//      token: token,
//      type: 2
//    }).then(function (distanceData) {
//      // fill data for every input control
//      for (var key in distanceData) {
//        $scope.distance[key] = distanceData[key];
//      }
//      
//      // back up
//      $scope.distanceBackUp = angular.copy($scope.distance);
//    }, function (errorCode) {
//      Dialog.error(errorCode);
//    });// End get distance
//    
    // Get shake chat setting
    API.call({
      api: 'get_general_setting',
      token: token,
      type: 3
    }).then(function (shakeChatData) {
      // fill data for every input control
      for (var key in shakeChatData) {
        $scope.chat[key] = shakeChatData[key];
      }
      
      // back up
      $scope.chatBackUp = angular.copy($scope.chat);
    }, function (errorCode) {
      Dialog.error(errorCode);
    });// End shake chat setting
    
    // Get Other setting
    API.call({
      api: 'get_general_setting',
      token: token,
      type: 4
    }).then(function (otherData) {
      // fill data for every input control
      for (var key in otherData) {
        if (key == 'wink_bomb_number') {
          $scope.other[key] = otherData[key] / 100;
        } else {
          $scope.other[key] = otherData[key];
        }
      }
      
      // back up
      $scope.otherBackUp = angular.copy($scope.other);
    }, function (errorCode) {
      Dialog.error(errorCode);
    });// End get other setting
    
    // Point setting
    $scope.pointSetting = function (dataSave) {
      var reqDataPointSet = {
        api: 'set_point_setting',
        token: token
      };
      
      // assign value for every keyword of object param tranfer to server
      for (var key in dataSave) {
        for(var i = 0; i < dataSave[key].length; i++ ) {
         reqDataPointSet[dataSave[key][i].name] =  dataSave[key][i].value;
        }
      }
      
      // call API
      API.call(reqDataPointSet).then(function () {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS',
          {nameSetting: $translate('SETTINGS.GENERAL.POINT_SETTING.TITLE')})
        }).then(function() {
          $scope.inputBackUpPoint = angular.copy($scope.input);
        });
      }, function (errorCode) {
        handleMessage($translate, Dialog, errorCode, reqDataPointSet.api);
      });
    };
    
    // cancel setting point
    $scope.cancelSetPoint = function () {
      $scope.input = angular.copy($scope.inputBackUpPoint);
    };
    
    // Distance setting
    $scope.distanceSetting = function () {
      var reqDataDistanceSet = {
        api: 'set_distance_setting',
        token: token
      };
      
      // assign value for every keyword of object param tranfer to server
      for (var key in $scope.distance) {
        reqDataDistanceSet[key] = parseFloatNullable($scope.distance[key]);
      }
      
      // call API
      API.call(reqDataDistanceSet).then(function () {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS',
          {nameSetting: $translate('SETTINGS.GENERAL.DISTANCE_SETTING.TITLE')})
        }).then(function() {
          $scope.distanceBackUp = angular.copy($scope.distance);
        });
      }, function (errorCode) {
        handleMessage($translate, Dialog, errorCode, reqDataDistanceSet.api);
        //Dialog.error(errorCode);
      });
    };
    
    // cancel distance setting
    $scope.cancelSetDistance = function () {
      $scope.distance = angular.copy($scope.distanceBackUp);
    };
    
    // Shake chat setting
    $scope.shakeChatSetting = function () {
      var reqDataShakeChatSet = {
        api: 'set_shake_chat_setting',
        token: token
      };
      
      // assign value for every keyword of object param tranfer to server
      for (var key in $scope.chat) {
        reqDataShakeChatSet[key] = parseInt($scope.chat[key]);
      }

      // call API
      API.call(reqDataShakeChatSet).then(function () {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS',
          {nameSetting: $translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.TITLE')})
        }).then(function() {
          $scope.chatBackUp = angular.copy($scope.chat);
        });
      }, function (errorCode) {
        handleMessage($translate, Dialog, errorCode, reqDataShakeChatSet.api);
      });
    };
    
    // cancel shake chat setting
    $scope.cancelSetShakeChat = function () {
      $scope.chat = angular.copy($scope.chatBackUp);
    };
    
    // Other setting
    $scope.otherSetting = function () {
      var reqDataOtherSet = {
        api: 'set_other_setting',
        token: token,
        wink_bomb_number: parseInt($scope.other.wink_bomb_number) * 100,
        look_time: parseInt($scope.other.look_time),
        unlock_fvt_time: parseInt($scope.other.unlock_fvt_time),
        unlock_chk_out_time: parseInt($scope.other.unlock_chk_out_time),
        unlock_bckstg_time: parseInt($scope.other.unlock_bckstg_time),
        auto_approved_img : parseInt($scope.other.auto_approved_img)
      };
      // call API
      API.call(reqDataOtherSet).then(function () {
        Dialog.alert({
          title: $translate('DIALOG.INFO_TITLE'),
          message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS',
          {nameSetting: $translate('SETTINGS.GENERAL.OTHER_SETTING.TITLE')})
        }).then(function() {
          $scope.otherBackUp = angular.copy($scope.other);
        });
      }, function (errorCode) {
        handleMessage($translate, Dialog, errorCode, reqDataOtherSet.api);
      });
    };
    //Count map
    $scope.countMap = function (maps) {
      var count = 0;
      for (var item in maps) {
          count ++;
      }
      return count;
    };
    // cancel other setting
    $scope.cancelSetOther = function () {
      $scope.other = angular.copy($scope.otherBackUp);
    };
    
    $scope.savePointSetting = function () {
      var updatePointSetting = {
        api: 'upd_aff',
        token: token,
        aff_id: item.aff_id,
        aff_name: item.aff_name,
        aff_login_id: item.aff_login_id,
        aff_pwd: item.aff_pwd,
        aff_email: item.aff_email,
        flag: parseInt(item.flag)
      };
    };
  };
  
  var handleMessageData = {
    set_point_setting : {
      4 : {
        control : '#reg_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.REGISTER'
      },
      6 : {
        control: '#day_bnus_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.DAILY_POINT_BONUS'
      },
      8 : {
        control : '#save_img_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.SAVE_IMAGE_POINT'
      },
      10 : {
        control : '#unlock_chk_out_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.CHECK_OUT_POINT'
      },
      12 : {
        control : '#unlock_fvt_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.FAVORITE_ME'
      },
      14 : {
        control : '#onl_alt_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.ONLINE_ALERT'
      },
      16 : {
        control : '#wink_bomb_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.WINK_BOMB'
      },
      18 : {
        control : '#ivt_frd_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.INVITE_FRIEND'
      },
      20 : {
        control : '#bckstg_rate_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.BACKSTAGE'
      },
      22 : {
        control : '#chat_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.CHAT'
      },
      24 : {
        control : '#video_call_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.VOICE_CALL'
      },
      26 : {
        control : '#voice_call_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.VIDEO_CALL'
      },
      28 : {
        control : '#wink_pnt_male',
        name : 'SETTINGS.GENERAL.POINT_SETTING.WINK'
      },

      5 : {
        control : '#reg_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.REGISTER'
      },
      7 : {
        control : '#day_bnus_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.DAILY_POINT_BONUS'
      },
      9 : {
        control : '#save_img_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.SAVE_IMAGE_POINT'
      },
      11 : {
        control : '#unlock_chk_out_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.CHECK_OUT_POINT'
      },
      13 : {
        control : '#unlock_fvt_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.FAVORITE_ME'
      },
      15 : {
        control : '#onl_alt_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.ONLINE_ALERT'
      },
      17 : {
        control : '#wink_bomb_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.WINK_BOMB'
      },
      19 : {
        control : '#ivt_frd_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.INVITE_FRIEND'
      },
      21 : {
        control : '#bckstg_rate_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.BACKSTAGE'
      },
      23 : {
        control : '#chat_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.CHAT'
      },
      25 : {
        control : '#video_call_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.VOICE_CALL'
      },
      27 : {
        control : '#voice_call_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.VIDEO_CALL'
      },
      29 : {
        control : '#wink_pnt_female',
        name : 'SETTINGS.GENERAL.POINT_SETTING.WINK'
      }
    },
    set_distance_setting : {
      4 : {
        control : '#near',
        name : 'SETTINGS.GENERAL.DISTANCE_SETTING.NEAR'
      },
      5 : {
        control : '#city',
        name : 'SETTINGS.GENERAL.DISTANCE_SETTING.CITY'
      },
      6 : {
        control : '#state',
        name : 'SETTINGS.GENERAL.DISTANCE_SETTING.STATE'
      },
      7 : {
        control : '#country',
        name : 'SETTINGS.GENERAL.DISTANCE_SETTING.COUNTRY'
      },
      8 : {
        control : '#local_buzz',
        name : 'SETTINGS.GENERAL.DISTANCE_SETTING.LOCAL_BUZZ'
      }
    },
    set_shake_chat_setting : {
      4 : {
        control : '#lower_age',
        name : 'SETTINGS.GENERAL.SHAKE_CHAT_SETTING.AGE'
      },
      5 : {
        control : '#upper_age',
        name : 'SETTINGS.GENERAL.SHAKE_CHAT_SETTING.AGE'
      }
    },
    set_other_setting : {
      4 : {
        control : '#wink_bomb_number',
        name : 'SETTINGS.GENERAL.OTHER_SETTING.WINK_NUM'
      },
      5 : {
        control : '#look_time',
        name : 'SETTINGS.GENERAL.OTHER_SETTING.LOOK_AT_ME_TIME'
      },
      6 : {
        control : '#unlock_fvt_time',
        name : 'SETTINGS.GENERAL.OTHER_SETTING.UNLOCK_FAVORITE_TIME'
      },
      7 : {
        control : '#unlock_chk_out_time',
        name : 'SETTINGS.GENERAL.OTHER_SETTING.UNLOCK_CHECK_OUT_TIME'
      },
      8 : {
        control : '#unlock_bckstg_time',
        name : 'SETTINGS.GENERAL.OTHER_SETTING.UNLOCK_BACKSTAGE_TIME'
      }
    }
  };
  
  var handleMessage = function (translate, Dialog, errorCode, api) {
    if (isSet(handleMessageData[api]) && isSet(handleMessageData[api][errorCode])) {
      var data = handleMessageData[api][errorCode];
      var fieldName = translate(data.name);
      
      Dialog.alert({
        title: translate('DIALOG.WARNING_TITLE'),
        message: translate('SETTINGS.GENERAL.POINT_SETTING.FIELD_ERROR', {fieldName: fieldName})
      }).then(function () {
        $(data.control).focus();
      });
    } else {
      Dialog.error(errorCode);
    }
  };
  
  PointSettingCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
  $app.controllers.controller('PointSettingCtrl', PointSettingCtrl);
}) ();