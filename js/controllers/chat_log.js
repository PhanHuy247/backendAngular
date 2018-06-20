(function () {
    var ChatLogCtrl = function ($scope, $sce, $routeParams, $translate, $modal, Session, API, Dialog, CSV) {
        $scope.token = Session.getAuthority().token;
        //var userId = $routeParams.id;
        $scope.translate = $translate;
        // function convert time
        $scope.secondsToTime = function (seconds) {
            if (isString(seconds))
                return;

            var m = Math.floor(seconds / 60);
            var s = seconds - m * 60;

            return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
        };

        $scope.chat_log = {};
        // Setting info paging
        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: $app.pageSize,
            currentPage: 1,
            totalItems: 0
        };

        // defined
        $scope.attributes = {
            userTypes: $app.labels.get('userTypes', true),
            //            finishType: $app.labels.get('condition_end_call', true),
            sortBys: [
                { value: 1, label: $translate('LOG.CHAT.CHAT_TIME') }
            ],
            orderBys: $app.labels.get('orderBys'),
            by_user_type: $app.labels.get('by_user_type'),
            message_type: $app.labels.get('message_type'),
            gender: $app.labels.get('genders', true),
            statusLogChatSendReceive: $app.labels.get('statusLogChatSendReceive')
        };
        $scope.chat_log.userType = $scope.attributes.userTypes[0].value;
        $scope.chat_log.sortBy = $scope.attributes.sortBys[0].value;
        $scope.chat_log.orderBy = $scope.attributes.orderBys[0].value;
        $scope.chat_log.gender = $scope.attributes.gender[0].value;
        $scope.chat_log.by_user_type = $scope.attributes.by_user_type[0].value;
        $scope.chat_log.message_type = $scope.attributes.message_type[0].value;

        if ($routeParams.id) {
            var userId = $routeParams.id;
            $scope.isLogAll = false;
            var reqDataGetUserDetail = {
                api: 'detail_user',
                token: $scope.token,
                id: userId
            };

            API.call(reqDataGetUserDetail).then(function (res) {
                $scope.user = res;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        } else {
            $scope.user = {};
            var userId = null;
            $scope.isLogAll = true;
            var date7ago = new Date();
            date7ago.setDate(date7ago.getDate() - 7);
            $scope.chat_log.fromTime = date7ago;
            $scope.chat_log.toTime = Date.now();
        }

        $scope.searchChatLog = function () {
            var from_time = new LocalTime($scope.chat_log.fromTime).toString();
            var to_time = new LocalTime($scope.chat_log.toTime).endOfDay().toString();
            var now = new LocalTime(Date.now()).toString();
            var end_now = new LocalTime(Date.now()).endOfDay().toString();
            var date7ago = new Date();
            date7ago.setDate(date7ago.getDate() - 7);
            var seven_day_ago = new LocalTime(date7ago).toString();
            //console.log(seven_day_ago);
            //console.log(date7ago.toLocaleDateString() + " ~ " + Date.now().toLocaleDateString());
            if ((from_time != null && from_time > now) || (to_time != null && to_time > end_now) || (from_time != null && from_time < seven_day_ago) || (to_time != null && to_time < seven_day_ago)) {
                Dialog.error($translate('LOG.CHAT.ERROR_MSG_TIME_NOT_VALID') + " ( " + date7ago.toLocaleDateString() + " ~ " + Date.now().toLocaleDateString() + " )");
                return;
            }
            if (from_time != null && to_time != null && from_time > to_time) {
                Dialog.error($translate('LOG.CHAT.ERROR_MSG_SELECT_TIME_VALID'));
                return;
            }
            $scope.setting.totalItems = 0;
            $scope.setting.currentPage = 1;
            $scope.load($scope.setting.currentPage);
        };

        $scope.load = function (page) {
            var reqSearchChatLog = {
                api: 'search_log_chat',
                token: $scope.token,
                req_user_id: userId,
                id: $scope.chat_log.userId,
                user_type: parseIntNullable($scope.chat_log.userType),
                gender: parseIntNullable($scope.chat_log.gender),
                email: ($scope.chat_log.userType === '' ? null : $scope.chat_log.account),
                from_time: new LocalTime($scope.chat_log.fromTime).toString(),
                to_time: new LocalTime($scope.chat_log.toTime).endOfDay().toString(),
                cm_code: $scope.chat_log.cmCode,
                sort: parseIntNullable($scope.chat_log.sortBy),
                by_user_type: parseIntNullable($scope.chat_log.by_user_type),
                message_type: parseIntNullable($scope.chat_log.message_type),
                order: parseIntNullable($scope.chat_log.orderBy),
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage
            };

            API.call(reqSearchChatLog).then(function (res) {
                console.log(res);
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.setting.totalItems = res.total;
                $scope.messageParams = {};

                for (var i in res.list) {
                    if (isFunction(buildDisplayContent[res.list[i].mess_type])) {
                        $scope.messageParams.p1 = res.list[i].user_name;
                        $scope.messageParams.p2 = $scope.user.user_name;

                        if (res.list[i].is_own) {
                            $scope.messageParams.p1 = $scope.user.user_name;
                            $scope.messageParams.p2 = res.list[i].user_name;
                        }
                        //#11611
                        if (res.list[i].content) {
                            var type = res.list[i].content.split('|');
                            res.list[i].is_free = null;
                            if (type[1] === 'a' || type[1] === 'v' || type[1] === 'p') {
                                if (isSet(type[4]) && type[4] == 0) {
                                    res.list[i].is_free = $translate('LOG.CHAT.CHARGE');
                                } else {
                                    res.list[i].is_free = $translate('LOG.CHAT.FREE');
                                }
                            }

                            if (type[1] === 'v') {
                                if (res.list[i].url) {
                                    res.list[i].video_flag = true;
                                } else {
                                    res.list[i].video_delete_flag = true;
                                }
                            }
                            if (type[1] === 'a') {
                                var url = $app.imageUrl + '/api=load_file&token=' + $scope.token + '&file_id=' + type[2];
                                res.list[i].audio_flag = true;
                                res.list[i].url = url;
                            }

                            res.list[i].content = $sce.trustAsHtml(buildDisplayContent[res.list[i].mess_type].call($scope, res.list[i]));
                        }

                    }
                }
                $scope.chatList = res.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        $scope.exportCSV = function () {
            var reqDataExportCSV = {
                api: 'search_log_chat',
                token: $scope.token,
                req_user_id: userId,
                id: $scope.chat_log.userId,
                user_type: parseIntNullable($scope.chat_log.userType),
                gender: parseIntNullable($scope.chat_log.gender),
                email: ($scope.chat_log.userType === '' ? null : $scope.chat_log.account),
                from_time: new LocalTime($scope.chat_log.fromTime).toString(),
                to_time: new LocalTime($scope.chat_log.toTime).endOfDay().toString(),
                cm_code: $scope.chat_log.cmCode,
                sort: parseIntNullable($scope.chat_log.sortBy),
                by_user_type: parseIntNullable($scope.chat_log.by_user_type),
                message_type: parseIntNullable($scope.chat_log.message_type),
                order: parseIntNullable($scope.chat_log.orderBy),
                csv: $app.timezone
            };

            CSV.get(reqDataExportCSV).then(function () {

            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };
    };

    var buildDisplayContent = new Object;
    buildDisplayContent.PP = function (item) {
        var encodedStrContent = item.content.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });

        var html = '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.PP', this.messageParams) + '</div>';
        html += '<div class="width-245px text-wrap">' + encodedStrContent + '</div>';

        return html;
    };

    buildDisplayContent.WINK = function (item) {
        var html = '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.WINK', this.messageParams) + '</div>';
        html += '<div>' + item.content + '</div>';

        return html;
    };

    // Location
    buildDisplayContent.LCT = function (item) {
        var arr = item.content.split('|');
        var mapUrl = $app.googleMapUrl.toString();
        var html = '';

        mapUrl = mapUrl.replace('{lat}', arr[0]);
        mapUrl = mapUrl.replace('{lng}', arr[1]);
        mapUrl = mapUrl.replace('{name}', arr[2].replace(/\s/g, '+'));

        html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.LCT', this.messageParams) + '</div>';
        html += '<div><a target="_blank" href="' + mapUrl + '">' + arr[2] + '</a></div>';

        return html;
    };

    // File
    buildDisplayContent.FILE = function (item) {
        var html = '';
        var arr = item.content.split('|');

        if (arr.length >= 3) {
            switch (arr[1]) {
                case 'p':
                    var url = $app.imageUrl + '/api=load_img_admin&token=' + this.token + '&img_id=' + arr[2] + '&img_kind=2';
                    html += '<p>' + this.translate('LOG.CHAT.MESSAGE_TYPE.P_FILE', this.messageParams) + '</p>';
                    html += '<div style="width: ' + $app.size.image.width + '; height: ' + $app.size.image.height + ';">';
                    html += '<a target="_blank" href="' + url + '"><img class="auto-image-size" src="' + url + '"></a></div>';
                    break;
                case 'a':
                    html += '<p>' + this.translate('LOG.CHAT.MESSAGE_TYPE.A_FILE', this.messageParams) + '</p>';
                    break;
                case 'v':
                    html += '<p>' + this.translate('LOG.CHAT.MESSAGE_TYPE.V_FILE', this.messageParams) + '</p>';
                    break;
            }
        } else {
            html += '<b><i class="text-error">' + this.translate('LOG.CHAT.MESSAGE_TYPE.FILE_ERROR') + '</i></b>';
        }
        if (item.video_delete_flag) {
            html += '<b><i class="text-error">' + this.translate('LOG.CHAT.MESSAGE_TYPE.VIDEO_DELETED') + '</i></b>';
        }
        return html;
    };

    // Sticker
    buildDisplayContent.STK = function (item) {
        var arr = item.content.split('_');
        var url = $app.imageUrl + '/api=load_img_admin&token=' + this.token + '&img_id=' + arr[1] + '&img_kind=3';
        var html = '';

        html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.STK', this.messageParams) + '</div>';
        html += '<div style="width: ' + $app.size.sticker.width + '; height: ' + $app.size.sticker.height + ';">';
        html += '<a target="_blank" href="' + url + '"><img class="auto-image-size" src="' + url + '"></a></div>';

        return html;
    };

    // SVOICE
    buildDisplayContent.SVOICE = function () {
        return this.translate('LOG.CHAT.MESSAGE_TYPE.SVOICE', this.messageParams);
    };

    // EVOICE
    buildDisplayContent.EVOICE = function (item) {
        //    var html = '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.EVOICE', this.messageParams) + '</div>';
        var html = '';
        var splitStr = item.content.toString().split('|');

        switch (parseInt(splitStr[0])) {
            case 2:
                //        html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.RESPONSE_ANSWER') + '</div>';
                //        html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.TIME_CALL', {time: this.secondsToTime(parseInt(splitStr[2]))}) + '</div>';
                html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.CALL_TIME', { time: this.secondsToTime(parseInt(splitStr[2])) }) + '</div>';
                break;
            case 3:
                html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.CANCEL') + '</div>';
                break;
            case 4:
                html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.BUSY') + '</div>';
                break;
        }

        return html;
    };

    // SVIDEO
    buildDisplayContent.SVIDEO = function () {
        return this.translate('LOG.CHAT.MESSAGE_TYPE.SVIDEO', this.messageParams);
    };

    // SVIDEO
    buildDisplayContent.EVIDEO = function (item) {
        //    var html = '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.EVIDEO', this.messageParams) + '</div>';
        var html = '';
        var splitStr = item.content.toString().split('|');

        switch (parseInt(splitStr[0])) {
            case 6:
                //        html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.RESPONSE_ANSWER') + '</div>';
                //        html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.TIME_CALL', {time: this.secondsToTime(parseInt(splitStr[2]))}) + '</div>';
                html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.CALL_TIME', { time: this.secondsToTime(parseInt(splitStr[2])) }) + '</div>';
                break;
            case 7:
                html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.CANCEL') + '</div>';
                break;
            case 8:
                html += '<div>' + this.translate('LOG.CHAT.MESSAGE_TYPE.BUSY') + '</div>';
                break;
        }

        return html;
    };

    // GIFT
    buildDisplayContent.GIFT = function (item) {
        var html = '';
        var splitStr = item.content.split('|');
        var url = $app.imageUrl + '/api=load_img_admin&token=' + this.token + '&img_id=' + splitStr[0] + '&img_kind=4';

        html += '<div class="span3"><div style="width: ' + $app.size.gift.width + '; height: ' + $app.size.gift.height + ';">';
        html += '<a target="_blank" href="' + url + '">';
        html += '<img src="' + url + '" class="auto-image-size"></a></div></div>';

        html += '<div class="span9">' + this.translate('LOG.CHAT.MESSAGE_TYPE.GIFT', this.messageParams) + '</div>';

        return html;
    };

    ChatLogCtrl.$inject = ['$scope', '$sce', '$routeParams', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
    $app.controllers.controller('ChatLogCtrl', ChatLogCtrl);
})();
