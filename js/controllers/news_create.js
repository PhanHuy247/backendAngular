/**
 * Created by NTQ on 04/08/2016.
 */

(function() {
    var NewsCreateCtrl = function($scope, $translate, Session, API, $modal, Dialog, $location, $routeParams, $filter) {
        window.scope = $scope;
        var token = Session.getAuthority().token;
        $scope.flag = false;
        $scope.editMode = isSet($routeParams.id);
        var pageTitle = '';
        if (!$scope.editMode){
            pageTitle = $translate('SETTINGS.CREATE_NEWS.CREATE_PAGE_TITLE');
        } else {
            pageTitle = $translate('SETTINGS.CREATE_NEWS.EDIT_PAGE_TITLE');
        }

        var filterTime = function(value){
            return value <= 9 ? '0'+value : value;
        };

        $scope.pageTitle = pageTitle;

        $scope.input = {
        };
        $scope.response = {};
        var date = new Date();
        $scope.input.from = {
            year : date.getFullYear(),
            month : filterTime(date.getMonth()+1),
            day: filterTime(date.getDate()),
            hour: filterTime(date.getHours()),
            minute: filterTime(date.getMinutes())
        };
        $scope.input.to = {
            year : date.getFullYear(),
            month : filterTime(date.getMonth()+1),
            day: filterTime(date.getDate()),
            hour: filterTime(date.getHours()),
            minute: filterTime(date.getMinutes())
        };
        $scope.input.register_from = null;
        $scope.input.register_to = null;
        var years = {};
        var months = {};
        var days = {};
        var hours = {};
        var minutes = {};


        var gender = [];
            gender['male']= 0;
            gender['female']= 1;

        var genTime = function(time , min , max){
            for (var i = min ; i<=max ;i++){
                time[filterTime(i)] = filterTime(i);
            }
            return time;
        };

        /*
        (key, value)
         */

        function daysInMonth(days, month, year){
            var temp = new Date(year, month, 0).getDate();
            for (var i = 1; i<=temp; i++){
                days[filterTime(i)] = filterTime(i);
            }
            return days;
        }

        function timeToYYYYMMDDHHMMFormat(inputTime) {
            var objDate= new Date(inputTime);
            var objUTC= new Date(objDate.getUTCFullYear(), objDate.getUTCMonth(), objDate.getUTCDate(), objDate.getUTCHours(), objDate.getUTCMinutes());
            return yyyyMMddHHmm(objUTC);
        }

        function timeToYYYYMMDDFormat(inputTime){
            var objDate= new Date(inputTime);
            var objUTC= new Date(objDate.getUTCFullYear(), objDate.getUTCMonth(), objDate.getUTCDate(), objDate.getUTCHours(), objDate.getUTCMinutes());
            return yyyyMMdd(objUTC);
        }

        function yyyyMMdd(date, isFormat){
            var years = date.getFullYear().toString();
            var months = filterTime((date.getMonth()+1).toString());
            var dates = filterTime(date.getDate().toString());
            if(!isFormat){
                return years + months + dates;
            } else {
                return {
                    year : years,
                    month : months,
                    day : dates
                }
            }
        }

        function yyyyMMddHHmm(date, isFormat) {
            var hours = filterTime(date.getHours().toString());
            var minutes = filterTime(date.getMinutes().toString());
            var years = date.getFullYear().toString();
            var months = filterTime((date.getMonth()+1).toString());
            var dates = filterTime(date.getDate().toString());
            if(!isFormat){
                return years + months + dates + hours + minutes;
            } else {
                return {
                    year : years,
                    month : months,
                    day : dates,
                    hour : hours,
                    minute : minutes
                }
            }
        }

        //$scope.$watchCollection('[input.register_time,input.register_type]', function(newValue, oldValue){
        //    var registerTime = $scope.input.register_time;
        //    var registerType = $scope.input.register_type;
        //    if (typeof registerTime != 'undefined' && typeof registerType != 'undefined' && registerTime!=null) {
        //        var register_from, register_to;
        //        if ($scope.input.register_type == 0) {
        //            register_from = 0 - $scope.input.register_time;
        //            register_to = 0;
        //        }
        //        else if ($scope.input.register_type == 1) {
        //            register_from = 0 - $scope.input.register_time;
        //            register_to = 0 - $scope.input.register_time
        //        }
        //        else if ($scope.input.register_type == 2) {
        //            register_to = 0 - $scope.input.register_time;
        //        }
        //        else
        //            return;
        //
        //        register_from = register_from == null ? "" : $filter('date')(LocalTime.from(getLapseTime(register_from)).time, 'yyyy/MM/dd');
        //        register_to = $filter('date')(LocalTime.from(getLapseTime(register_to)).time, 'yyyy/MM/dd');
        //        if (register_from == register_to)
        //            $scope.properties.register_demo = register_from;
        //        else
        //            $scope.properties.register_demo = register_from + " ~ " + register_to;
        //    }
        //});

        var convertTime = function(time){
            var timeInput = time.year+'/'+time.month+'/'+time.day+' '+time.hour+':'+time.minute;
            timeInput = timeInput.toString();
            return timeToYYYYMMDDHHMMFormat(timeInput);
        };

        var getLapseTime = function(lapse){
            var time = new Date();
            time = time.setDate(time.getDate() + lapse);
            return timeToYYYYMMDDFormat(time);
        };

        $scope.properties = {
            register_type: $app.labels.get('registerTypes', true),
            user_type : $app.labels.get('userTypes', true),
            years : genTime(years, 2014, 2030),
            months : genTime(months, 1, 12),
            days : genTime(days, 1, 31),
            hours : genTime(hours, 0, 23),
            minutes : genTime(minutes, 0, 59),
            size : $app.size.image,
            accept: 'image/jpeg, image/gif, image/png'
        };
        $scope.input.target_user_type = $scope.properties.user_type[0].value;
        $scope.input.register_type = $scope.properties.register_type[0].value;
        $scope.properties.limit = {
            width: 165,
            height: 70
        };

        var generateImageUrl = function(id) {
            return $app.imageUrl + '/api=load_img_admin&token=' + token + '&img_id=' + id + '&img_kind=6#' + Date.now().getTime();
        };

        if($scope.editMode){
            API.call({
                api : 'get_news_detail',
                token : token,
                id : $routeParams.id
            }).then(function(response) {
                var localFrom = LocalTime.from(response.fromStr, true);
                var localTo= LocalTime.from(response.toStr, true);

                $scope.input = response;
                if (isSet(response.banner_id)){
                    $scope.input.imgSrc = generateImageUrl(response.banner_id);
                }
                $scope.input.from = yyyyMMddHHmm(localFrom.time, true);
                $scope.input.to = yyyyMMddHHmm(localTo.time, true);
                if (response.device_type == 0){
                    $scope.input.device_type = 'ios';
                } else if(response.device_type == 1) {
                    $scope.input.device_type = 'android';
                }

                if (response.target_gender == 0){
                    $scope.input.target_gender = 'male';
                } else if(response.target_gender == 1) {
                    $scope.input.target_gender = 'female';
                }
                if (response.is_purchase === true)
                    $scope.input.is_purchase="1";
                else if (response.is_purchase === false)
                    $scope.input.is_purchase="0";
                if (response.have_email === true)
                    $scope.input.have_email="1";
                else if (response.have_email === false)
                    $scope.input.have_email="0";
                $scope.input.target_user_type = response.user_type ==null? $scope.properties.user_type[0].value : response.user_type;

                $scope.input.register_type = response.register_from?response.register_type:"";
                $scope.input.register_from = response.register_from?LocalTime.from(response.register_from, true):"";
                $scope.input.register_to = response.register_to?LocalTime.from(response.register_to, true):"";
            },function(code){
                Dialog.error(code);
            });
        }

        $scope.add = function(){
            if ($scope.flag) return;
            $scope.flag = true;

            var periodFrom = convertTime($scope.input.from);
            var periodTo = convertTime($scope.input.to);
            var deviceType, targetGender, have_email, is_purchase;
            if (periodFrom >= periodTo){
                Dialog.alert({
                    title : $translate('DIALOG.INFO_TITLE'),
                    message : $translate('SETTINGS.CREATE_NEWS.MSG_TO_NOT_BE_LESS_THAN_FROM')
                });
                $scope.flag = false;
                return;
            }
            if ($scope.input.device_type == 'ios'){
                deviceType = 0;
            } else if($scope.input.device_type == 'android') {
                deviceType = 1;
            } else {
                deviceType = null;
            }

            if ($scope.input.target_gender == 'male'){
                targetGender = 0;
            } else if($scope.input.target_gender == 'female') {
                targetGender = 1;
            } else {
                targetGender = null;
            }

            if ($scope.input.have_email == "1")
                have_email = true;
            else if ($scope.input.have_email == "0")
                have_email = false;
            else
                have_email = null;

            if ($scope.input.is_purchase == "1")
                is_purchase = true;
            else if ($scope.input.is_purchase == "0")
                is_purchase = false;
            else
                is_purchase = null;

            var reqDataInsNews = {
                api : 'insert_news',
                token : token,
                title : $scope.input.title,
                content : $scope.input.content,
                from : periodFrom,
                to : periodTo,
                device_type : deviceType,
                target_gender : targetGender,
                have_email: have_email,
                is_purchase: is_purchase,
                user_type: $scope.input.target_user_type,
                register_from: $scope.input.register_from?$scope.input.register_from.time.local(LocalTime.formats.yyyyMMdd):null,
                register_to: $scope.input.register_to?$scope.input.register_to.time.local(LocalTime.formats.yyyyMMdd):null,
                register_type: $scope.input.register_from?$scope.input.register_type:""
            };

            if($scope.editMode){
                reqDataInsNews.api = 'update_news';
                reqDataInsNews.id = $routeParams.id
            } else {
                reqDataInsNews.api = 'insert_news'
            }

            if($scope.input.base64){
                var param = {
                    data : $scope.input.base64
                };
                var URL_IMG = $app.imageUrl + '/api=upl_news_banner&token=' + token;

                API.call(param, false, URL_IMG).then(function(response){
                    if(isSet(response)){
                        reqDataInsNews.banner_id = response.id;
                        API.call(reqDataInsNews).then(function(response){
                            $scope.flag = false;
                            var message = $scope.editMode?$translate('SETTINGS.CREATE_NEWS.MSG_UPDATE_SUCCESS'):$translate('SETTINGS.CREATE_NEWS.MSG_ADD_SUCCESS');
                            Dialog.alert({
                                title : $translate('DIALOG.INFO_TITLE'),
                                message : message
                            });
                            $location.path('/settings/news');
                        }, function(code){
                            Dialog.error(code);
                            $scope.flag = false;
                        });
                    }
                }, function(code){
                    Dialog.error(code);
                });
            } else if ($scope.input.base64==""){
                $scope.input.base64 = undefined;
                var message = $scope.editMode?$translate('SETTINGS.CREATE_NEWS.MSG_INVALID_SIZE'):$translate('SETTINGS.CREATE_NEWS.MSG_INVALID_SIZE');
                Dialog.alert({
                    title : $translate('DIALOG.INFO_TITLE'),
                    message : message
                });
                $scope.flag = false;
            }
            else {
                API.call(reqDataInsNews).then(function(){
                    $scope.flag = false;
                    var message = $scope.editMode?$translate('SETTINGS.CREATE_NEWS.MSG_UPDATE_SUCCESS'):$translate('SETTINGS.CREATE_NEWS.MSG_ADD_SUCCESS');
                    Dialog.alert({
                        title : $translate('DIALOG.INFO_TITLE'),
                        message : message
                    });
                    $location.path('/settings/news');
                }, function(code){
                    var errorMessage;
                    if (code == 4)
                        errorMessage = $translate('SETTINGS.CREATE_NEWS.INVALID_TITLE');
                    else if (code == 5)
                        errorMessage = $translate('SETTINGS.CREATE_NEWS.INVALID_CONTENT');
                    else if (code == 6)
                        errorMessage = $translate('SETTINGS.CREATE_NEWS.MSG_TO_NOT_BE_LESS_THAN_FROM');
                    else if (code == 7)
                        errorMessage = $translate('SETTINGS.CREATE_NEWS.MSG_ADD_ERROR_TO');
                    Dialog.alert({
                        title : $translate('DIALOG.INFO_TITLE'),
                        message : errorMessage
                    });
                    $scope.flag = false;
                });
            }
        };

        $scope.preview = function(item){
            $modal.open({
            templateUrl : 'partials/news_preview.html',
            controller : newsPreviewCtrl,
            windowClass : 'news-preview-modal',
            resolve : {
              item : function() {
                return item;
              }
            }
          });
        };

        $scope.selectTimeFrom = function(item){
            var month = $scope.input.from.month;
            var year = $scope.input.from.year;
            $scope.properties.days = {};
            daysInMonth($scope.properties.days, month, year);
        };

        $scope.selectTimeTo = function(item){
            var month = $scope.input.to.month;
            var year = $scope.input.to.year;
            $scope.properties.days = {};
            daysInMonth($scope.properties.days, month, year);
        }

    };
    var newsPreviewCtrl = function($scope, $translate, $modalInstance, Session, item) {
        $scope.item = item;
        var token = Session.getAuthority().token;
        var path = $app.imageUrl + '/api=load_img_admin&token=' + token +
                    '&img_id=' + item.banner_id + '&img_kind=6';

        $scope.item.pathImage = path;
        $scope.item.view_detail = $translate('SETTINGS.CREATE_NEWS.PREVIEW_NEWS.VIEW_DETAIL_TEXT');
        $scope.item.show_news = false;

        $scope.viewDetail = function() {
            if (!$scope.item.show_news) {
                $scope.item.show_news = true;
                $scope.item.view_detail = $translate('SETTINGS.CREATE_NEWS.PREVIEW_NEWS.CLOSE_DETAIL_TEXT');
            }else {
                $scope.item.show_news = false;
                $scope.item.view_detail = $translate('SETTINGS.CREATE_NEWS.PREVIEW_NEWS.VIEW_DETAIL_TEXT');
            }
        };

        $scope.Ok = function() {
          $modalInstance.close();
        };
    };

    NewsCreateCtrl.$inject = ['$scope', '$translate', 'Session', 'API', '$modal', 'Dialog', '$location', '$routeParams', '$filter'];
    $app.controllers.controller('NewsCreateCtrl', NewsCreateCtrl);
}) ();
