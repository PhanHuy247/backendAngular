(function () {
    var VoiceVideoCallCtrl = function ($scope, $translate, $modal, Session, API, Dialog, CSV) {
        var token = Session.getAuthority().token;
        $scope.voice_video = {};

        $scope.setting = {
            itemsPerPage: $app.pageSize,
            numberPagesDisplay: $app.pageDisplay,
            currentPage: 1,
            totalItems: 0
        };

        $scope.attributes = {
            userTypes: $app.labels.get('userTypes', true),
            orderBys: $app.labels.get('orderBys'),
            finishType: $app.labels.get('condition_end_call', true),
            sortBys: [{
                    value: 1,
                    label: $translate('LOG.VOICE_VIDEO_CALL.START_TIME')
                }
            ],
            callTypes: [{
                    value: '',
                    label: $translate('FORM.PLEASE_SELECT')
                }, {
                    value: 1,
                    label: $translate('LOG.VOICE_VIDEO_CALL.VOICE')
                }, {
                    value: 2,
                    label: $translate('LOG.VOICE_VIDEO_CALL.VIDEO')
                }
            ]
        };
        $scope.voice_video.reqUserType = $scope.attributes.userTypes[0].value;
        $scope.voice_video.partnerUserType = $scope.attributes.userTypes[0].value;
        $scope.voice_video.orderBy = $scope.attributes.orderBys[0].value;
        $scope.voice_video.sortBy = $scope.attributes.sortBys[0].value;
        $scope.voice_video.type = $scope.attributes.callTypes[0].value;

        $scope.searchVoiceVideoCall = function () {
            $scope.setting.totalItems = 0;
            $scope.setting.currentPage = 1;
            $scope.load($scope.setting.currentPage);
        };

        $scope.load = function (page) {
            if ($scope.voice_video.reqUserType === $scope.attributes.userTypes[0].value) {
                $scope.voice_video.reqAccount = null;
            }

            if ($scope.voice_video.partnerUserType === $scope.attributes.userTypes[0].value) {
                $scope.voice_video.partnerAccount = null;
            }

            var reqDataSearchVoiceVideoCall = {
                api: 'search_log_call',
                token: token,
                req_id: $scope.voice_video.reqUserId,
                req_user_type: parseIntNullable($scope.voice_video.reqUserType),
                req_email: $scope.voice_video.reqAccount,
                req_cm_code: $scope.voice_video.reqCmCode,

                partner_id: $scope.voice_video.partnerUserId,
                partner_user_type: parseIntNullable($scope.voice_video.partnerUserType),
                partner_email: $scope.voice_video.partnerAccount,
                partner_cm_code: $scope.voice_video.partnerCmCode,

                from_time: new LocalTime($scope.voice_video.fromTime).toString(),
                to_time: new LocalTime($scope.voice_video.toTime).endOfDay().toString(),
                from_dur: parseIntNullable($scope.voice_video.durationFrom),
                to_dur: parseIntNullable($scope.voice_video.durationTo),
                type: parseIntNullable($scope.voice_video.type),

                sort: parseIntNullable($scope.voice_video.sortBy),
                order: parseIntNullable($scope.voice_video.orderBy),
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage
            };

            API.call(reqDataSearchVoiceVideoCall).then(function (res) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.setting.totalItems = res.total;

                for (var i in res.list) {
                    res.list[i].duration = secondsToTime(res.list[i].duration);
                }

                $scope.voiceVideoCalls = res.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        $scope.exportCSV = function () {
            if ($scope.voice_video.reqUserType === $scope.attributes.userTypes[0].value) {
                $scope.voice_video.reqAccount = null;
            }

            if ($scope.voice_video.partnerUserType === $scope.attributes.userTypes[0].value) {
                $scope.voice_video.partnerAccount = null;
            }

            var reqDataExportCSV = {
                api: 'search_log_call',
                token: token,
                req_id: $scope.voice_video.reqUserId,
                req_user_type: parseIntNullable($scope.voice_video.reqUserType),
                req_email: $scope.voice_video.reqAccount,
                req_cm_code: $scope.voice_video.reqCmCode,

                partner_id: $scope.voice_video.partnerUserId,
                partner_user_type: parseIntNullable($scope.voice_video.partnerUserType),
                partner_email: $scope.voice_video.partnerAccount,
                partner_cm_code: $scope.voice_video.partnerCmCode,

                from_time: new LocalTime($scope.voice_video.fromTime).toString(),
                to_time: new LocalTime($scope.voice_video.toTime).endOfDay().toString(),
                from_dur: parseIntNullable($scope.voice_video.durationFrom),
                to_dur: parseIntNullable($scope.voice_video.durationTo),
                type: parseIntNullable($scope.voice_video.type),

                sort: parseIntNullable($scope.voice_video.sortBy),
                order: parseIntNullable($scope.voice_video.orderBy),
                csv: $app.timezone
            };

            CSV.get(reqDataExportCSV).then(function () {

            }, function (errorCode) {
                Dialog.error(errorCode);
            });
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
    // function convert time
    var secondsToTime = function (seconds) {
        if (isString(seconds))
            return;

        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds - (h * 3600)) / 60);
        var s = seconds - (h * 3600) - (m * 60);

        return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    };

    VoiceVideoCallCtrl.$inject = ['$scope', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
    $app.controllers.controller('VoiceVideoCallCtrl', VoiceVideoCallCtrl);
})();