(function () {
    // General setting controller
    var GeneralSettingCtrl = function ($scope, $translate, Session, API, Dialog, $http) {
        var token = Session.getAuthority().token;
        $scope.input = {};
        $scope.inputBackUpPoint = {};
        $scope.distance = {};
        $scope.distanceBackUp = {};
        $scope.other = {};
        $scope.otherBackUp = {};
        $scope.version = {};
        $scope.versionBackUp = {};
        $scope.chat = {};
        $scope.chatBackUp = {};
        $scope.property = {};
        //#11014
        $scope.input_upload = {};
        $scope.uploadBackUp = {};

        $scope.property = {
            ethn: $app.labels.get('ethnicities', true),
            region: $app.labels.get('region'),
            autoApprove: $app.labels.get('autoApproveState'),
            showPaymentPage: $app.labels.get('showPaymentPage'),
            //#11014
            size: $app.size.sticker,
        };

        var orderConversation = $app.labels.get('orderConversation');
        var orderConnectPoint = $app.labels.get('orderConnectPoint');
        var translate = {
            male: 'USER.INFO.MALE',
            female: 'USER.INFO.FEMALE'
        };
        $scope.defineTab = $app.labels.get('defineTab');

        $scope.sConnectPoint = constructConnectPoint(orderConnectPoint, translate);
        $scope.sConnectPointBackUp = {};

        $scope.sConversation = constructConversation(orderConversation, translate);
        $scope.sConversationBackUp = {};

        $scope.regionDisable = false;
        $scope.$watch(function () {
            $scope.chat['distance'] = parseIntNullable($scope.chat['distance']);
            return $scope.chat['distance'];
        }, function (newValue) {
            //TODO : some
        });
        $scope.defaultProperty = $app.labels.get('defaultProperty');
        $scope.orderedInput = $app.labels.get('orderedInput'); // input of Tab Point setting
        $scope.state = $app.labels.get('state');
        $scope.other = {
            turn_off_safary: $scope.state[0].value,
            turn_off_login_by_mocom: $scope.state[0].value,
            turn_off_get_free_point: $scope.state[0].value,
            turn_off_extended_user_info: $scope.state[0].value,
            turn_off_show_news: $scope.state[0].value,
            turn_off_browser_android: $scope.state[0].value,
            turn_off_login_by_mocom_android: $scope.state[0].value,
            turn_off_get_free_point_android: $scope.state[0].value,
            turn_off_extended_user_info_android: $scope.state[0].value,
            turn_off_show_news_android: $scope.state[0].value,
            auto_approved_video: $scope.property.autoApprove[0].value,
            showPaymentPage: $scope.property.showPaymentPage[0].value,
        };

        /*Point setting*/
        API.call({
            api: 'get_general_setting',
            token: token,
            type: 1
        }).then(function (pntdata) {
            // fill data for every input control
            for (var key in pntdata) {
                $scope.input[key] = pntdata[key];
                for (var area in $scope.orderedInput) {
                    //console.log(area);
                    for (var i = 0; i < $scope.orderedInput[area].length; i++) {
                        if ($scope.orderedInput[area][i].name === key) {
                            $scope.orderedInput[area][i].value = pntdata[key];
                        }
                    }

                }
            }
            // back up input
            $scope.orderedInputBackUp = angular.copy($scope.orderedInput);
        }, function (errorCode) {
            Dialog.error(errorCode);
        });
        $scope.pointSetting = function (dataSave) {
            var reqDataPointSet = {
                api: 'set_point_setting',
                token: token
            };
            var error;
            // assign value for every keyword of object param tranfer to server
            for (var key in dataSave) {
                //Logic of system
                for (var i = 0; i < dataSave[key].length; i++) {
                    if (dataSave[key][i].name == "receive_gift" || dataSave[key][i].name == "unlock_backstage_bonus") {
                        if (dataSave[key][i].value['female_req_tradable_point'] + dataSave[key][i].value['female_req_untradable_point'] > 100) {
                            errorReceiveGiftBackstageBonus(dataSave[key][i].name, 'female', $translate, Dialog, reqDataPointSet.api);
                            return;
                        } else if (dataSave[key][i].value['male_req_tradable_point'] + dataSave[key][i].value['male_req_untradable_point'] > 100) {
                            errorReceiveGiftBackstageBonus(dataSave[key][i].name, 'male', $translate, Dialog, reqDataPointSet.api);
                            return;
                        } else if (dataSave[key][i].value['other_req_tradable_point'] + dataSave[key][i].value['other_req_untradable_point'] > 100) {
                            errorReceiveGiftBackstageBonus(dataSave[key][i].name, 'other', $translate, Dialog, reqDataPointSet.api);
                            return;
                        }
                    }
                    reqDataPointSet[dataSave[key][i].name] = dataSave[key][i].value;
                }
            }
            // call API
            API.call(reqDataPointSet).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.POINT_SETTING.TITLE')
                    })
                }).then(function () {
                    $scope.inputBackUpPoint = angular.copy($scope.input);
                });
            }, function (errorCode) {
                handleMessage($translate, Dialog, errorCode, reqDataPointSet.api);
            });
        };
        /* End Tab "Point setting"*/

        //#11014 Set upload setting
        API.call({
            api: 'get_upload_setting',
            token: token,
        }).then(function (uploadData) {
            
            for (var key in uploadData) {
                $scope.input_upload[key] = uploadData[key];
                $scope.input_upload.imgSrcAudioImg = uploadData.default_audio_img;
                $scope.input_upload.imgSrcDeletedImg = uploadData.share_has_deleted_img;
            }
            // back up
            $scope.uploadBackUp = angular.copy($scope.input_upload);
        }, function (errorCode) {
            Dialog.error(errorCode.code);
        });

        $scope.saveUploadSetting = function (item_upload) {
            const formData = new FormData();
            //get file of image audio
            var file_audio = item_upload.filesAudioImg;
            angular.forEach(file_audio, function (val_file_audio, key) {
                formData.append('files', val_file_audio);
            });
            //get file of image deleted
            var file_deleted = item_upload.filesDeletedImg;
            angular.forEach(file_deleted, function (val_file_del, key) {
                formData.append('files', val_file_del);
            });
            formData.append('api', 'upl_file');
            formData.append('token', token);
            $http.post($app.imageUrl, formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (result) {
                if (isSet(item_upload.base64AudioImg) && isSet(item_upload.base64DeletedImg)) {
                    delete item_upload.base64AudioImg;
                    item_upload.imgSrcAudioImg = result.data.data[0].original_url;
                    delete item_upload.base64DeletedImg;
                    item_upload.imgSrcDeletedImg = result.data.data[1].original_url;
                    $scope.updateUploadSetting(result.data.data, 2); // update when upload 2 image 
                } else if (isSet(item_upload.base64AudioImg)) {
                    delete item_upload.base64AudioImg;
                    item_upload.imgSrcAudioImg = result.data.data[0].original_url;
                    $scope.updateUploadSetting(result.data.data, 0); // update when upload image audio
                } else if (isSet(item_upload.base64DeletedImg)) {
                    delete item_upload.base64DeletedImg;
                    item_upload.imgSrcDeletedImg = result.data.data[0].original_url;
                    $scope.updateUploadSetting(result.data.data, 1); // update when upload image deleted
                } else {
                    $scope.updateUploadSetting('', -1); // update no upload any image 
                }
            }, function (err) {
                alert(err.code);
                console.log(err.code);
            });
        };
        $scope.updateUploadSetting = function (item_upload, type) {
            switch (type) {
                case 0:
                    $scope.file_id_audio = item_upload[0].file_id;
                    $scope.file_id_deleted = '';
                    break;
                case 1:
                    $scope.file_id_audio = '';
                    $scope.file_id_deleted = item_upload[0].file_id;
                    break;
                case 2:
                    $scope.file_id_audio = item_upload[0].file_id;
                    $scope.file_id_deleted = item_upload[1].file_id;
                    break;
                case -1:
                    $scope.file_id_audio = '';
                    $scope.file_id_deleted = '';
                    break;
                default:
            }
            var reqUploadSetting = {
                api: 'set_upload_setting',
                token: token,
                max_length_buzz: parseInt($scope.input_upload.max_length_buzz),
                max_file_size: parseInt($scope.input_upload.max_file_size),
                total_file_size: parseInt($scope.input_upload.total_file_size),
                max_image_number: parseInt($scope.input_upload.max_image_number),
                max_video_number: parseInt($scope.input_upload.max_video_number),
                max_audio_number: parseInt($scope.input_upload.max_audio_number),
                total_file_upload: parseInt($scope.input_upload.total_file_upload),
                max_file_per_album: parseInt($scope.input_upload.max_file_per_album),
                default_audio_img: $scope.file_id_audio, 
                share_has_deleted_img: $scope.file_id_deleted, 
            };
            API.call(reqUploadSetting).then(function (res) {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.UPLOAD_SETTING.TITLE')
                    })
                });
            }, function (errorCode) {
                console.log(errorCode.code);
                handleMessage($translate, Dialog, errorCode, reqUploadSetting.api);
            });
        };
        /* End Tab "Set upload setting"*/

        /*Connect point setting */
        API.call({
            api: 'get_general_setting',
            token: token,
            type: 6
        }).then(function (dataConnectPoint) {
            $scope.setConnectPoint(dataConnectPoint);
        }, function (errorCode) {
            Dialog.error(errorCode);
        });
        $scope.setConnectPoint = function (data) {
            angular.forEach(data, function (value, key) {
                for (var j = 0; j < $scope.sConnectPoint[key].length; j++) {
                    $scope.sConnectPoint[key][j].data.receiver.value = value[$scope.sConnectPoint[key][j].name].receiver.value;
                    $scope.sConnectPoint[key][j].data.potential_customer_receiver.value = value[$scope.sConnectPoint[key][j].name].potential_customer_receiver.value;
                    $scope.sConnectPoint[key][j].data.sender.value = value[$scope.sConnectPoint[key][j].name].sender.value;
                    $scope.sConnectPoint[key][j].data.potential_customer_sender.value = value[$scope.sConnectPoint[key][j].name].potential_customer_sender.value;
                }
            });
            $scope.sConnectPointBackUp = angular.copy($scope.sConnectPoint);
        };
        $scope.connectPointSetting = function () {
            var reqDataDistanceSet = $scope.getConnectPoint($scope.sConnectPoint);
            reqDataDistanceSet['api'] = 'set_connection_point_setting';
            reqDataDistanceSet['token'] = token;
            // call API
            API.call(reqDataDistanceSet, true).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.CONNECT_POINT_SETTING.TITLE')
                    })
                }).then(function () {
                    $scope.sConversationBackUp = angular.copy($scope.sConnectPoint);
                });
            }, function (response) {
                // tabName, fieldName, typePersion,translate, Dialog, api
                var typePersion;
                if ((response.code % 2) === 0) {
                    typePersion = 'sender';
                } else {
                    typePersion = 'receiver';
                }

                if (response.data != null) {
                    errorConversationSetting(
                        response.data.tab,
                        getErrorCodeConversation(response.code, orderConnectPoint),
                        typePersion,
                        $scope.defineTab.connectPoint,
                        response.code,
                        $translate,
                        Dialog,
                        reqDataDistanceSet.api);
                } else {
                    Dialog.error(response.code);
                }
            });
        };
        $scope.getConnectPoint = function (data) {
            var result = {};
            angular.forEach(data, function (value, key) {
                result[key] = {};
                for (var i = 0; i < value.length; i++) {
                    result[key][value[i].name] = {};
                    angular.forEach(value[i].data, function (valueData, keyData) {
                        result[key][value[i].name][keyData] = {
                            name: valueData.name,
                            value: valueData.value
                        };
                    });
                }
            });
            return result;
        };
        /*End Tab "Connect point setting"*/

        /*Video-voice setting*/
        API.call({
            api: 'get_general_setting',
            token: token,
            type: 5
        }).then(function (conversationdata) {
            $scope.setConversation(conversationdata);
        });
        $scope.setConversation = function (data) {
            angular.forEach(data, function (value, key) {
                for (var j = 0; j < $scope.sConversation[key].length; j++) {
                    $scope.sConversation[key][j].data.receiver.value = value[$scope.sConversation[key][j].name].receiver.value;
                    $scope.sConversation[key][j].data.potential_customer_receiver.value = value[$scope.sConversation[key][j].name].potential_customer_receiver.value;
                    $scope.sConversation[key][j].data.caller.value = value[$scope.sConversation[key][j].name].caller.value;
                    $scope.sConversation[key][j].data.potential_customer_caller.value = value[$scope.sConversation[key][j].name].potential_customer_caller.value;
                }
            });
            $scope.sConversationBackUp = angular.copy($scope.sConversation);
        };
        $scope.conversationSetting = function () {
            var reqDataDistanceSet = $scope.getConversation($scope.sConversation);
            reqDataDistanceSet['api'] = 'set_communication_setting';
            reqDataDistanceSet['token'] = token;
            // call API
            API.call(reqDataDistanceSet, true).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.CONVERSATION_SETTING.TITLE')
                    })
                }).then(function () {
                    $scope.sConversationBackUp = angular.copy($scope.sConversation);
                });
            }, function (response) {
                //        tabName, fieldName, typePersion,translate, Dialog, api
                var typePersion;
                if ((response.code % 2) === 0) {
                    typePersion = 'caller';
                } else {
                    typePersion = 'receiver';
                }

                if (response.data != null) {
                    errorConversationSetting(
                        response.data.tab,
                        getErrorCodeConversation(response.code, orderConversation),
                        typePersion,
                        $scope.defineTab.conversation,
                        response.code,
                        $translate,
                        Dialog,
                        reqDataDistanceSet.api);
                } else {
                    Dialog.error(response.code);
                }
            });
        };
        $scope.getConversation = function (data) {
            var result = {};
            angular.forEach(data, function (value, key) {
                result[key] = {};
                for (var i = 0; i < value.length; i++) {
                    result[key][value[i].name] = {};
                    angular.forEach(value[i].data, function (valueData, keyData) {
                        result[key][value[i].name][keyData] = {
                            name: valueData.name,
                            value: valueData.value
                        };
                    });
                }
            });
            return result;
        };
        /*End Tab "Video-voice setting"*/

        /*Distance setting*/
        API.call({
            api: 'get_general_setting',
            token: token,
            type: 2
        }).then(function (distanceData) {
            // fill data for every input control
            for (var key in distanceData) {
                $scope.distance[key] = distanceData[key];
            }

            // back up
            $scope.distanceBackUp = angular.copy($scope.distance);
        }, function (errorCode) {
            Dialog.error(errorCode);
        });

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
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.DISTANCE_SETTING.TITLE')
                    })
                }).then(function () {
                    $scope.distanceBackUp = angular.copy($scope.distance);
                });
            }, function (errorCode) {
                handleMessage($translate, Dialog, errorCode, reqDataDistanceSet.api);
                //Dialog.error(errorCode);
            });
        };
        /*End Tab Distance setting*/

        /*Version setting*/
        API.call({
            api: 'get_general_setting',
            token: token,
            type: 7
        }).then(function (versionData) {
            // fill data for every input control
            for (var key in versionData) {
                $scope.version[key] = versionData[key];
            }

            // back up
            $scope.versionBackUp = angular.copy($scope.version);
        }, function (errorCode) {
            Dialog.error(errorCode);
        });

        $scope.versionSetting = function () {
            var reqDataVersionSet = {
                api: 'set_version_setting',
                token: token,
                android_usable_version: $scope.version.android_usable_version,
                ios_enterprise_usable_version: $scope.version.ios_enterprise_usable_version,
                ios_non_enterprise_usable_version: $scope.version.ios_non_enterprise_usable_version
            };
            // call API
            API.call(reqDataVersionSet).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.VERSION_SETTING.TITLE')
                    })
                }).then(function () {
                    $scope.otherBackUp = angular.copy($scope.version);
                });
            }, function (errorCode) {
                handleMessage($translate, Dialog, errorCode, reqDataOtherSet.api);
            });
        };

        /*End Tab Version setting*/

        /*Other setting*/
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
        });
        $scope.otherSetting = function () {
            var reqDataOtherSet = {
                api: 'set_other_setting',
                token: token,
                unlock_bckstg_time: parseInt($scope.other.unlock_bckstg_time),
                auto_approved_img: parseInt($scope.other.auto_approved_img),
                auto_approved_buzz: parseInt($scope.other.auto_approved_buzz),
                auto_approved_comment: parseInt($scope.other.auto_approved_comment),
                auto_approved_user_info: parseInt($scope.other.auto_approved_user_info),
                auto_hide_reported_image: parseInt($scope.other.auto_hide_reported_image),
                turn_off_safary: $scope.other.turn_off_safary,
                turn_off_login_by_mocom: $scope.other.turn_off_login_by_mocom,
                turn_off_get_free_point: $scope.other.turn_off_get_free_point,
                turn_off_extended_user_info: $scope.other.turn_off_extended_user_info,
                turn_off_show_news: $scope.other.turn_off_show_news,
                turn_off_safary_version: $scope.other.turn_off_safary_version,
                turn_off_browser_android: $scope.other.turn_off_browser_android,
                turn_off_login_by_mocom_android: $scope.other.turn_off_login_by_mocom_android,
                turn_off_get_free_point_android: $scope.other.turn_off_get_free_point_android,
                turn_off_extended_user_info_android: $scope.other.turn_off_extended_user_info_android,
                turn_off_show_news_android: $scope.other.turn_off_show_news_android,
                turn_off_browser_android_version: $scope.other.turn_off_browser_android_version,
                unlock_listen_audio_time: $scope.other.unlock_listen_audio_time,
                unlock_watch_video_time: $scope.other.unlock_watch_video_time,
                unlock_view_image_time: $scope.other.unlock_view_image_time,
                auto_approved_video: parseInt($scope.other.auto_approved_video),
                showPaymentPage: parseInt($scope.other.showPaymentPage),
                auto_hide_reported_video: parseInt($scope.other.auto_hide_reported_video),
            };
            API.call(reqDataOtherSet).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.OTHER_SETTING.TITLE_MSG')
                    })
                }).then(function () {
                    $scope.otherBackUp = angular.copy($scope.other);
                });
            }, function (errorCode) {
                handleMessage($translate, Dialog, errorCode, reqDataOtherSet.api);
            });
        };
        /*End Tab Other setting*/


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
        }); // End shake chat setting

        // Shake chat setting
        $scope.shakeChatSetting = function () {
            var reqDataShakeChatSet = {
                api: 'set_shake_chat_setting',
                token: token
            };
            if ($scope.chat['distance'] != 2) {
                $scope.chat['region'] = [];
            }
            // assign value for every keyword of object param tranfer to server
            for (var key in $scope.chat) {
                reqDataShakeChatSet[key] = $scope.chat[key];
            }

            // call API
            API.call(reqDataShakeChatSet).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.GENERAL.SETTING_SUCCESS', {
                        nameSetting: $translate('SETTINGS.GENERAL.SHAKE_CHAT_SETTING.TITLE')
                    })
                }).then(function () {
                    $scope.chatBackUp = angular.copy($scope.chat);
                });
            }, function (errorCode) {
                handleMessage($translate, Dialog, errorCode, reqDataShakeChatSet.api);
            });
        };

        //Count map
        $scope.countMap = function (maps) {
            var count = 0;
            for (var item in maps) {
                count++;
            }
            return count;
        };

        $scope.cancel = function (name) {
            $scope[name] = angular.copy($scope[name + 'BackUp']);
        };

        //Logical : if "male" or "female" in "minus" block is zero then "female" or "male" in "add" block is zero,too.
        $scope.changeValue = function (gender, block, name, value) {
            if (name === 'unlock_backstage' && value == 0) {
                var oppositeAttributeName;
                switch (gender) {
                    case 'female_req_point':
                        oppositeAttributeName = 'male_partner_point';
                        break;
                    case 'male_req_point':
                        oppositeAttributeName = 'female_partner_point';
                        break;
                    case 'female_partner_point':
                        oppositeAttributeName = 'male_req_point';
                        break;
                    case 'male_partner_point':
                        oppositeAttributeName = 'female_req_point';
                        break;
                }
                for (var key in $scope.orderedInput.areasAddMinusPoint) {
                    if ($scope.orderedInput.areasAddMinusPoint[key].name === "unlock_backstage") {
                        $scope.orderedInput.areasAddMinusPoint[key].value[oppositeAttributeName] = 0;
                    }
                }
            }
        };
    };

    var constructConnectPoint = function (arrayItem, cf_translater) {
        var arrayType = ['chat', 'save_image', 'comment_buzz', 'unlock_backstage', 'view_image', 'watch_video', 'listen_audio', 'reply_comment', 'watch_secret_video'];
        var result = {};
        for (var j = 0; j < arrayType.length; j++) {
            result[arrayType[j]] = [];
            for (var i = 0; i < arrayItem.length; i++) {
                var values = arrayItem[i].name.split("_");
                result[arrayType[j]][i] = {
                    name: arrayItem[i].name,
                    data: {
                        receiver: {
                            name: values[1],
                            value: 0,
                            label: cf_translater[values[1]]
                        },
                        potential_customer_receiver: {
                            name: values[1],
                            value: 0,
                            label: cf_translater[values[1]]
                        },
                        sender: {
                            name: values[0],
                            value: 0,
                            label: cf_translater[values[0]]
                        },
                        potential_customer_sender: {
                            name: values[0],
                            value: 0,
                            label: cf_translater[values[0]]
                        }
                    }
                };
            }
        }
        return result;
    };

    var constructConversation = function (arrayItem, cf_translater) {
        var arrayType = ['video_call', 'voice_call'];
        var result = {};
        for (var j = 0; j < arrayType.length; j++) {
            result[arrayType[j]] = [];
            for (var i = 0; i < arrayItem.length; i++) {
                var values = arrayItem[i].name.split("_");
                result[arrayType[j]][i] = {
                    name: arrayItem[i].name,
                    data: {
                        receiver: {
                            name: values[1],
                            value: 0,
                            label: cf_translater[values[1]]
                        },
                        potential_customer_receiver: {
                            name: values[1],
                            value: 0,
                            label: cf_translater[values[1]]
                        },
                        caller: {
                            name: values[0],
                            value: 0,
                            label: cf_translater[values[0]]
                        },
                        potential_customer_caller: {
                            name: values[0],
                            value: 0,
                            label: cf_translater[values[0]]
                        }
                    }
                };
            }
        }
        return result;
    };

    var handleMessageData = {
        set_point_setting: {
            4: {
                control: '#reg_pnt_male',
                name: 'SETTINGS.GENERAL.POINT_SETTING.DAILY_POINT_BONUS'
            },
            10: {
                control: '#day_bnus_pnt_male',
                name: 'SETTINGS.GENERAL.POINT_SETTING.INVITE_FRIEND'
            },
            16: {
                control: '#save_img_pnt_male',
                name: 'SETTINGS.GENERAL.POINT_SETTING.ADVERTISEMENT'
            },
            22: {
                control: '#unlock_chk_out_pnt_male',
                name: 'SETTINGS.GENERAL.POINT_SETTING.REGISTER'
            },
            28: {
                control: '#unlock_fvt_pnt_male',
                name: 'LOG.POINT.SELECT.ADD_BUZZ_BONUS'
            },
            34: {
                control: '#ivt_frd_pnt_male',
                name: 'LOG.POINT.SELECT.ADD_LOOKING_FOR'
            },
            40: {
                control: '#bckstg_rate_male',
                name: 'LOG.POINT.SELECT.ADD_ABOUT_ME'
            },
            46: {
                control: '#chat_pnt_male',
                name: 'LOG.POINT.SELECT.ADD_AVATAR'
            },
            52: {
                control: '#video_call_pnt_male',
                name: 'LOG.POINT.SELECT.ADD_RELATIONSHIP'
            },
            58: {
                control: '#voice_call_pnt_male',
                name: 'LOG.POINT.SELECT.ADD_BODY_TYPE'
            },
            64: {
                control: '#wink_pnt_male',
                name: 'LOG.POINT.SELECT.ADD_HEIGHT'
            },
            70: {
                control: '#reg_pnt_female',
                name: 'SLOG.POINT.SELECT.ADD_ETHNICITY'
            },
            76: {
                control: '#day_bnus_pnt_female',
                name: 'LOG.POINT.SELECT.ADD_INTERES'
            },
            82: {
                control: '#onl_alt_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.UNLOCK_BACKSTAGE_BONUS'

            },
            88: {
                control: '#wink_bomb_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.GIVE_GIFT'
            },
            94: {
                control: '#ivt_frd_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.FAVORITE_ME'
            },
            97: {
                control: '#save_img_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.WHO_CHECKED_ME_OUT'
            },
            100: {
                control: '#unlock_chk_out_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.WINK_BOMB'
            },
            103: {
                control: '#unlock_fvt_pnt_female',
                name: 'SSETTINGS.GENERAL.POINT_SETTING.ONLINE_ALERT'
            },
            106: {
                control: '#bckstg_rate_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.WINK'
            },
            115: {
                control: '#chat_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.VIEW_IMAGE_WHITE_CHATTING'
            },
            124: {
                control: '#video_call_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.SEND_STAMP'
            },
            133: {
                control: '#voice_call_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.SAVE_IMAGE'
            },
            142: {
                control: '#ivt_frd_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.CHAT'

            },
            200: {
                control: '#ivt_frd_pnt_female',
                name: 'SETTINGS.GENERAL.POINT_SETTING.DIALOG_ALERT.MES_SET_SUM_ER'

            }
        },
        set_distance_setting: {
            4: {
                control: '#near',
                name: 'SETTINGS.GENERAL.DISTANCE_SETTING.NEAR'
            },
            5: {
                control: '#city',
                name: 'SETTINGS.GENERAL.DISTANCE_SETTING.CITY'
            },
            6: {
                control: '#state',
                name: 'SETTINGS.GENERAL.DISTANCE_SETTING.STATE'
            },
            7: {
                control: '#country',
                name: 'SETTINGS.GENERAL.DISTANCE_SETTING.COUNTRY'
            },
            8: {
                control: '#local_buzz',
                name: 'SETTINGS.GENERAL.DISTANCE_SETTING.LOCAL_BUZZ'
            }
        },
        set_shake_chat_setting: {
            4: {
                control: '#lower_age',
                name: 'SETTINGS.GENERAL.SHAKE_CHAT_SETTING.AGE'
            },
            5: {
                control: '#upper_age',
                name: 'SETTINGS.GENERAL.SHAKE_CHAT_SETTING.AGE'
            }
        },
        set_other_setting: {
            4: {
                control: '#wink_bomb_number',
                name: 'SETTINGS.GENERAL.OTHER_SETTING.WINK_NUM'
            },
            5: {
                control: '#look_time',
                name: 'SETTINGS.GENERAL.OTHER_SETTING.LOOK_AT_ME_TIME'
            },
            6: {
                control: '#unlock_fvt_time',
                name: 'SETTINGS.GENERAL.OTHER_SETTING.UNLOCK_FAVORITE_TIME'
            },
            7: {
                control: '#unlock_chk_out_time',
                name: 'SETTINGS.GENERAL.OTHER_SETTING.UNLOCK_CHECK_OUT_TIME'
            },
            8: {
                control: '#unlock_bckstg_time',
                name: 'SETTINGS.GENERAL.OTHER_SETTING.UNLOCK_BACKSTAGE_TIME'
            }
        },
        set_communication_setting: {
            4: {
                control: '#wink_bomb_number',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_MALE_MALE'
            },
            6: {
                control: '#look_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_MALE_FEMALE'
            },
            8: {
                control: '#unlock_fvt_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_MALE_OTHER'
            },
            10: {
                control: '#unlock_chk_out_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_FEMALE_MALE'
            },
            12: {
                control: '#unlock_bckstg_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_FEMALE_FEMALE'
            },
            14: {
                control: '#unlock_bckstg_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_FEMALE_OTHER'
            },
            16: {
                control: '#unlock_bckstg_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_OTHER_MALE'
            },
            18: {
                control: '#unlock_bckstg_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_OTHER_FEMALE'
            },
            20: {
                control: '#unlock_bckstg_time',
                name: 'SETTINGS.GENERAL.CONVERSATION_SETTING.ERR_MESSAGE_OTHER_OTHER'
            }
        },
        set_upload_setting: {
            667: {
                control: '#err_number_file',
                name: 'SETTINGS.GENERAL.UPLOAD_SETTING.ERR_MESSAGE_NUMBER_FILE'
            },
        },
    };
    /*
     *
     ***List One  Add Object : 4 <= errorCode < 94
     daily_bonus ( 4 - 9)
     invite_friend ( 10- 15)
     advertsement ( 16 - 21)
     register ( 22 - 27)
     add_buzz_bonus ( 28- 33)
     add_looking_for ( 34 -39)
     add_about_me ( 40- 45)
     add_avatar ( 46 - 51)
     add_relationship ( 52 - 57)
     add_body_type ( 58- 63)
     add_height ( 64- 69)
     add_ethnicity ( 70 - 75)
     add_interes ( 76 - 81)
     unlock_backstage_bonus ( 82 - 87)
     receive_gift ( 88 - 93)
     
     ***List One Minus Object : 93 < errorCode < 106
     who_favorited_me ( 94 - 96)
     who_check_me_out ( 97 - 99)
     wink_bomb ( 100 - 102)
     online_alert ( 103 - 105)
     
     ***List Two Object: 106 <= errorCode < 151
     wink ( 106 - 114)
     view_image ( 115 - 123)
     send_sticker ( 124 - 132)
     save_image ( 133 - 141)
     chat(142 - 150)"
     
     */
    var getErrorCode = function (errorCode) {
        //List One Object
        if (4 <= parseInt(errorCode) && parseInt(errorCode) < 94) {
            var a = 4;
            while (a <= 93) {
                if (a <= errorCode && errorCode < (a + 6)) {
                    return a;
                    break;
                }
                a = a + 6;
            }
        } else if (93 < parseInt(errorCode) && parseInt(errorCode) < 106) {
            if (errorCode % 3 === 0) {
                return errorCode - 2;
            } else if (errorCode % 3 === 1) {
                return errorCode;
            } else if (errorCode % 3 === 2) {
                return errorCode - 1;
            }
        }
        //List Two Object
        else if (106 <= errorCode && errorCode < 151) {
            var a = 106;
            while (a <= 150) {
                if (a <= errorCode && errorCode < (a + 9)) {
                    return a;
                    break;
                }
                a = a + 9;
            }
        } else {
            return errorCode;
        }
    };

    var getErrorCodeConversation = function (errorCode, listError) {
        var fieldName;
        errorCode = Math.floor((errorCode / 2)) * 2;
        for (var i = 0; i < listError.length; i++) {
            if (listError[i].errorCode === errorCode)
                fieldName = listError[i].name;
        }

        return fieldName;
    };

    var errorConversationSetting = function (tabName, fieldName, typePersion, defineTab, errorCode, translate, Dialog, api) {
        errorCode = Math.floor((errorCode / 2)) * 2;
        var nameError = 'error';
        $('#myTab a[href="#' + defineTab[tabName] + '"]').tab('show');
        var callFunction = function () {
            var idName = '#' + tabName + '_' + typePersion + '_' + fieldName;
            $('.control-group').removeClass(nameError);
            $(idName).addClass(nameError);
            $(idName).focus();
        };
        handleMessage(translate, Dialog, errorCode, api, callFunction);
    };

    var errorReceiveGiftBackstageBonus = function (fieldName, genderName, translate, Dialog, api) {
        var callFunction = function () {
            var className = '.areasAddPoint_' + fieldName + '_' + genderName + '_req_tradable_point';
            $(className).addClass('error');
            $(className).focus();
        };
        handleMessage(translate, Dialog, 200, api, callFunction);
    };
    var handleMessage = function (translate, Dialog, errorCode, api, callbackFunc) {
        if (api === 'set_point_setting') {
            errorCode = getErrorCode(errorCode);
        } else if (api === 'set_point_setting') {

        }
        if (isSet(handleMessageData[api]) && isSet(handleMessageData[api][errorCode])) {
            var data = handleMessageData[api][errorCode];
            var fieldName = getFieldNameExceptionMessage(translate, data.name);

            Dialog.alert({
                title: translate('DIALOG.WARNING_TITLE'),
                message: translate('SETTINGS.GENERAL.POINT_SETTING.FIELD_ERROR', {
                    fieldName: fieldName
                })
            }).then(function () {
                if (callbackFunc) {
                    callbackFunc();
                }

                $(data.control).focus();
            });
        } else {
            Dialog.error(errorCode);
        }
    };
    var getFieldNameExceptionMessage = function (translate, fieldName) {
        var str = '';
        switch (fieldName) {
            case "SETTINGS.GENERAL.POINT_SETTING.GIVE_GIFT":
                str = translate('SETTINGS.GENERAL.POINT_SETTING.GIVE_GIFT_SHORT');
                break;
            case "SETTINGS.GENERAL.POINT_SETTING.UNLOCK_BACKSTAGE_BONUS":
                str = translate('SETTINGS.GENERAL.POINT_SETTING.UNLOCK_BACKSTAGE_BONUS_SHORT');
                break;
            default:
                str = translate(fieldName);
                break;
        }
        return str;
    };

    GeneralSettingCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog', '$http'];
    $app.controllers.controller('GeneralSettingCtrl', GeneralSettingCtrl);
})();