(function () {
    var AutoNotificationCreateCtrl = function ($scope, $routeParams, $location, $translate, API, Session, Dialog) {
        $scope.sendTime = Date.now();
        $scope.input = {
            time: Date.now()
        };
        var criteria = angular.fromJson($routeParams.data);
        var token = Session.getAuthority().token;

        $scope.createAutoNotification = function () {
            criteria = angular.extend({}, criteria, {
                api: 'ins_auto_push',
                token: token,
                content: isSet($scope.input.content) ? $scope.input.content.replace(/^\s+|\s+$/g, "") : null,
                url: isSet($scope.input.url) ? $scope.input.url : null,
                sender: $scope.input.sender,
                time: new LocalTime($scope.input.time, true).toString(LocalTime.formats.yyyyMMddHHmm)
            });

            API.call(criteria).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('USER.USER_AUTO_NOTIFICATION.MESS_UPDATE_CONTENT')
                }).then(function () {
                    $scope.input.showError = {};
                    $location.path('/user/auto_notification_list');
                });
            }, function (errorCode) {
                errorProcess.call($scope, $translate, Dialog, errorCode, $scope.input);
            });
        };
    };
    var messageDataHandle = {
        4: {
            control: '#url',
            name: 'url',
            message: 'USER.USER_AUTO_NOTIFICATION.MESS_ERR_TITLE'
        },
        5: {
            control: '#content',
            name: 'content',
            message: 'USER.USER_AUTO_NOTIFICATION.MESS_UPDATE_CONTENT_ERROR'
        },
        6: {
            control: '#time',
            name: 'time',
            message: 'USER.USER_AUTO_NOTIFICATION.MESS_UPDATE_TIME_ERROR'
        }
    };

    var errorProcess = function (translate, Dialog, errorCode, item) {
        var data = messageDataHandle[errorCode];
        item.showError = {};

        if (isSet(data)) {
            Dialog.alert({
                title: translate('DIALOG.WARNING_TITLE'),
                message: translate(data.message)
            }).then(function () {
                item.showError[data.name] = true;
                $(data.control).focus();
            });
        } else {
            Dialog.error(errorCode);
        }
    };

    AutoNotificationCreateCtrl.$inject = ['$scope', '$routeParams', '$location', '$translate', 'API', 'Session', 'Dialog'];
    $app.controllers.controller('AutoNotificationCreateCtrl', AutoNotificationCreateCtrl);
})();
