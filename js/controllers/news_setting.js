/**
 * Created by NTQ on 04/07/2016.
 */
(function() {
    var NewsSettingCtrl = function($scope, $translate, Session, API, Dialog) {
        var token = Session.getAuthority().token;
        $scope.flag = false;
        $scope.setting = {
            numberPagesDisplay : $app.pageDisplay,
            itemsPerPage : $app.pageSize,
            currentPage : 1,
            totalItems : 0
        };

        $scope.attributes = {
            showStatus : [ {
                value : 0,
                label : $translate('SETTINGS.NEWS.BEING_DISPLAY') 
            }, {
                value : 1,
                label : $translate('SETTINGS.NEWS.NOT_YET_DISPLAY')
            }, {
                value : -1,
                label : $translate('SETTINGS.NEWS.FINISH_DISPLAY')
            } ],
            deviceType : [ {
                value : 0,
                label : $translate('USER.INFO.IOS_DEVICE')
            }, {
                value : 1,
                label : $translate('USER.INFO.ANDROID_DEVICE')
            },{
                value : -1,
                label : $translate('SETTINGS.NEWS.BOTH')
            } ],
            isPurchase : [{
                value : true,
                label : $translate('FORM.YES')
            }, {
                value : false,
                label : $translate('FORM.NO')
            }, {
                value : -1,
                label : $translate('SETTINGS.NEWS.BOTH')
            }],
            registerType : [{
                value : 0,
                label : $translate('SETTINGS.NEWS.LESSTHAN')
            },
            {
                value: 1,
                label: $translate('SETTINGS.NEWS.EXACTLY')
            },
            {
                value: 2,
                label: $translate('SETTINGS.NEWS.MORETHAN')
            },]
        };

        $scope.load = function(page) {
            var reqDataNewsList = {
                api : 'list_news_backend',
                token : token,
                skip : (page - 1) * $scope.setting.itemsPerPage,
                take : $scope.setting.itemsPerPage
            };

            API.call(reqDataNewsList).then(function(response){
                $scope.setting.totalItems = response.total;
                for (var i in response.list) {
                    response.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
                        + '&img_id=' + response.list[i].banner_id + '&img_kind=6';
                    if(!isSet(response.list[i].device_type)){
                        response.list[i].device_type = -1;
                    }
                    if(!isSet(response.list[i].is_purchase)){
                        response.list[i].is_purchase = -1;
                    }
                }
                $scope.list = response.list;
                console.log($scope.list);
            }, function(errorCode) {
                Dialog.error(errorCode);
            });
        };
        $scope.load(1);

         //Delete
        $scope.deleteNews = function(item) {
            Dialog.confirm({
                title : $translate('DIALOG.CONFIRM_TITLE'),
                message : $translate('SETTINGS.NEWS.MSG_CONFIRM_DELETE')
            }).then(function(result) {
                if (result) {
                    if ($scope.flag) return;
                    $scope.flag = true;

                    API.call({
                        api : 'delete_news',
                        token : token,
                        id : item.id
                    }).then(function() {
                        Dialog.alert({
                            title : $translate('DIALOG.INFO_TITLE'),
                            message : $translate('SETTINGS.NEWS.MSG_DELETE_SUCCESS')
                        }).then(function() {
                            var offset = $scope.list.length === 1 ? 1 : 0;
                            var page = $scope.setting.currentPage - offset;

                            $scope.setting.currentPage = page < 1 ? 1 : page;

                            $scope.load($scope.setting.currentPage);
                        });
                        $scope.flag = false;
                    }, function(errorCode) {
                        $scope.flag = false;
                        Dialog.error(errorCode);
                    });
                }
            });
        };

        $scope.updateNewsToApp = function(){
            if($scope.flag) return;
            $scope.flag = true;
            API.call({
                api : 'update_news_to_app',
                token : token
            }).then (function(res){
                Dialog.alert({
                    title : $translate('DIALOG.INFO_TITLE'),
                    message : $translate('SETTINGS.NEWS.UPDATE_NEWS_TO_APP_SUCCESS')
                });
                $scope.flag = false;
                $scope.load(1);
            },function(code){
                Dialog.error(code);
                $scope.flag = false;
            });
        };

        function convert(register_type, register_time){

        }

    };

    NewsSettingCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
    $app.controllers.controller('NewsSettingCtrl', NewsSettingCtrl);
}) ();
