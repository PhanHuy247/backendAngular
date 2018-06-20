/**
 * Created by HuyDX on 5/19/2016.
 */
(function() {
    var LoginMessageCreateCtrl = function($scope, $location, $translate, API, Session, Dialog) {
        window.loginscope = $scope;
        $scope.input = {};
        var token = Session.getAuthority().token;
        $scope.properties = {
            messageTypes : [],
            gender : [
                {
                    id : 0,
                    name : $translate('USER.INFO.MALE')
                }, {
                    id : 1,
                    name : $translate('USER.INFO.FEMALE')
                },
                {
                    name : $translate('USER.INFO.BOTH')
                }]
        };
        /*
         * call api get select message_type
         */
         console.log($scope.properties);
        API.call({
            token : token,
            api : 'get_sys_acc'
        }).then(function(response) {
            $scope.properties.messageTypes = response;
            $scope.input.sender = $scope.properties.messageTypes[0].id;
        }, function(errorCode) {
            Dialog.error(errorCode).then(function() {
                $location.path('/user/login_message');
            });
        });



        $scope.createLoginMessage = function() {
            var criteria ={
                token : token,
                api : 'insert_login_bonus_message',
                content : isSet($scope.input.content) ? $scope.input.content : null,
                sender : $scope.input.sender,
                gender : $scope.input.gender,
                login_bonus_times : $scope.input.login_bonus_times
            };
            API.call(criteria).then(function() {
                Dialog.alert({
                    title : $translate('DIALOG.INFO_TITLE'),
                    message : $translate('USER.USER_LOGIN_MESSAGE.MESS_UPDATE_CONTENT')
                }).then(function() {
                    $scope.input.showError = {};
                    $location.path('/user/login_message');
                });
            }, function(errorCode) {
                errorProcess.call($scope, $translate, Dialog, errorCode, $scope.input);
            });
        };
    };
    var messageDataHandle = {
        4 : {
            control : '#login_bonus_times',
            name : 'USER.USER_LOGIN_MESSAGE.DAILY_BONUS_NUMBER',
            message : 'USER.USER_LOGIN_MESSAGE.DAILY_BONUS_NUMBER'
        },
        5 : {
            control : '#messageType',
            name : 'USER.USER_LOGIN_MESSAGE.MESSAGE_TYPE',
            message : 'USER.USER_LOGIN_MESSAGE.MESSAGE_TYPE'
        },
        6 : {
            control : '#content',
            name : 'USER.USER_LOGIN_MESSAGE.CONTENT',
            message : 'USER.USER_LOGIN_MESSAGE.CONTENT'
        }
    };

    var errorProcess = function(translate, Dialog, errorCode, item) {
        var data = messageDataHandle[errorCode];
        item.showError = {};

        if (isSet(data)) {
            var name = translate(data.name);
            Dialog.alert({
                title: translate('DIALOG.WARNING_TITLE'),
                message: translate('SETTINGS.FREE_PAGE.FIELD_ERROR',{fieldName:name})
            }).then(function() {
                item.showError[data.name] = true;
                $(data.control).focus();
            });
        } else {
            Dialog.error(errorCode);
        }
    };

    LoginMessageCreateCtrl.$inject = [ '$scope', '$location', '$translate', 'API', 'Session', 'Dialog' ];
    $app.controllers.controller('LoginMessageCreateCtrl', LoginMessageCreateCtrl);
})();
