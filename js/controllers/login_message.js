/**
 * Created by HuyDX on 5/19/2016.
 */
(function() {
    var LoginMessageCtrl = function ($scope, $q, $location, $translate, $modal, API, Session, Dialog) {
        $scope.properties={
            messageTypes : new Array,
            //gender : [{id: 0, name: "Male"}, {id:1, name: "Female"},{name:"Both"}],
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
                }],
            pageSize : $app.pageSize,
            currentPage : 1,
            pageDisplay : $app.pageDisplay,
            total : 0
        };

        var token = Session.getAuthority().token;

        API.call({
            token:token,
            api: 'get_sys_acc'
        }).then(function(response){
            $scope.properties.messageTypes = response;
        }, function(errorCode){
            Dialog.error(errorCode).then(function() {
                $location.path('/');
            });
        });

        $scope.load = function(page){
            API.call({
                token: token,
                api: 'list_login_bonus_message',
                skip: $scope.properties.pageSize*(page-1),
                take: $scope.properties.pageSize
            }).then(function(response){
                $scope.properties.total=response.total;
                $scope.messages = response.list;
            }, function(errorCode){
                Dialog.error(errorCode);
            });
        };

        $scope.load(1);

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


        $scope.save = function(item){
            API.call({
                api : 'update_login_bonus_message',
                token : token,
                id : item.id,
                login_bonus_times : item.login_bonus_times,
                sender : item.sender,
                content : item.content,
                gender: item.gender
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

        $scope.remove = function(item){
            Dialog.confirm({
                title : $translate('DIALOG.CONFIRM_TITLE'),
                message : $translate('USER.USER_AUTO_MESSAGE.CONFIRM_DELETE_MESSAGE')
            }).then(function(result){
                if (result){
                API.call({
                    api: 'delete_login_bonus_message',
                    token: token,
                    id: item.id
                }).then(function(){
                    var offset = $scope.messages.length === 1 ? 1 : 0;
                    var page = $scope.properties.currentPage - offset;

                    $scope.properties.currentPage = page < 1 ? 1 : page;

                    $scope.load($scope.properties.currentPage);
                });
                }
            });

        };

        $scope.edit = function(item){
            item.isEditMode = true;
            item.$clone = angular.copy(item);
        };

        $scope.cancel = function(item){
            var clone = item.$clone;
            delete item.$clone;
            for (var key in clone){
                item[key]=clone[key];
            }
            item.isEditMode=false;
        }

    };

    var InfoDialogCtrl = function($scope, $modal, $modalInstance, services, item) {
        var token = services.Session.getAuthority().token;
        $scope.attributes = {
            userTypes: $app.labels.get('userTypes')
        };

        var nameDialog = services.$translate('DIALOG.ERROR_TITLE');

        $scope.title = services.$translate('USER.USER_LOGIN_MESSAGE.RECEIVERS_TITLE', {nameDialog: nameDialog});

        $scope.properties = {
            pageSize : $app.pageSize,
            currentPage : 1,
            pageDisplay : $app.pageDisplay,
            total : 0
        };

        $scope.load = function(page) {
            var reqData = {
                api: 'get_receivers_login_bonus_message',
                token: token,
                id: item.id,
                skip : $scope.properties.pageSize * (page - 1),
                take : $scope.properties.pageSize
            };
            services.API.call(reqData).then(function(res) {
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

    LoginMessageCtrl.$inject = ['$scope', '$q', '$location', '$translate', '$modal', 'API', 'Session', 'Dialog'];
    $app.controllers.controller('LoginMessageCtrl', LoginMessageCtrl);
})();