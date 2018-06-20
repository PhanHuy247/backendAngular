(function () {
    var AutoMessageCreateCtrl = function ($scope, $routeParams, $location, $translate, API, Session, Dialog) {
        $scope.sendTime = Date.now();
        var criteria = angular.fromJson($routeParams.data);
        var token = Session.getAuthority().token;
        $scope.properties = {
            messageTypes: []
        };

        /*
         * call api get select message_type
         */
        API.call({
            token: token,
            api: 'get_sys_acc'
        }).then(function (response) {
            $scope.properties.messageTypes = response;
            $scope.input = {
                sender: $scope.properties.messageTypes[0].id,
                time: Date.now()
            };
        }, function (errorCode) {
            Dialog.error(errorCode).then(function () {
                $location.path('/user/auto_message_list');
            });
        });

        $scope.createAutoMessage = function () {
            criteria.api = 'ins_auto_mess';
            criteria.token = token;
            criteria.content = isSet($scope.input.content) ? $scope.input.content : null;
            criteria.sender = $scope.input.sender;
            criteria.time = new LocalTime($scope.input.time, true).toString(LocalTime.formats.yyyyMMddHHmm);
            API.call(criteria).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('USER.USER_AUTO_MESSAGE.MESS_UPDATE_CONTENT')
                }).then(function () {
                    $scope.input.showError = {};
                    $location.path('/user/auto_message_list');
                });
            }, function (errorCode) {
                errorProcess.call($scope, $translate, Dialog, errorCode, $scope.input);
            });
        };
    };
    var messageDataHandle = {
        4: {
            control: '#messageType',
            name: 'messageType',
            message: 'USER.USER_AUTO_NOTIFICATION.MESS_ERR_TITLE'
        },
        5: {
            control: '#content',
            name: 'content',
            message: 'USER.USER_AUTO_MESSAGE.MESS_UPDATE_CONTENT_ERROR'
        },
        6: {
            control: '#time',
            name: 'time',
            message: 'USER.USER_AUTO_MESSAGE.MESS_UPDATE_TIME_ERROR'
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

    AutoMessageCreateCtrl.$inject = ['$scope', '$routeParams', '$location', '$translate', 'API', 'Session', 'Dialog'];
    $app.controllers.controller('AutoMessageCreateCtrl', AutoMessageCreateCtrl);
})();
