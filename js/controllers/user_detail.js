(function () {
    // User detail
    var UserDetailCtrl = function ($scope, $location, $q, $routeParams, $modal, $translate, API, Dialog, Session) {
        var CREATE_AUTO_NOTIFICATION = 0;
        var CREATE_NEW_LOGIN = 1;
        var CREATE_AUTO_MESSAGE = 2;
        var ADD_POINT = 3;
        var CREATE_CONTACT = 4;

        var job = $app.labels.get('job');
        var userId = $routeParams.userId;
        $scope.getJob = function ($sex, $job) {

            $sex = parseIntNullable($sex);
            //  $sex = parseIntNullable($scope.user.gender);
            //  nữ 0-16 ,nam 17-38
            var confJob = {
                1: [0, 16],
                0: [17, 38]
            };
            var min = confJob[0][0];
            var max = confJob[0][1];

            if ($job !== -1 && $job !== "" && $job !== null) {
                var result = [];
            } else {
                var result = [{
                        value: -1,
                        label: $translate('FORM.ASK_ME')
                    }];
            }

            if ($sex !== 0 && $sex !== 1) {
                min = 0;
                max = 38;
            } else {
                min = confJob[$sex][0];
                max = confJob[$sex][1];
            }
            for (var i = 0; i < job.length; i++) {
                if (job[i].value >= min && job[i].value <= max) {
                    result.push(job[i]);
                }
            }
            $scope.properties.job = result;
            if ($job === undefined) {
                $scope.user.job = null;
            }
            return result;
        };

        //body_type
        var body_type = $app.labels.get('body_type');
        $scope.getBodyType = function ($sex, $body_type) {

            $sex = parseIntNullable($sex);
            //   $sex = parseIntNullable($scope.user.gender);
            var confBodyType = {
                1: [0, 7],
                0: [8, 15]
            };
            var min = confBodyType[0][0];
            var max = confBodyType[0][1];

            if ($body_type !== -1 && $body_type !== "" && $body_type !== null) {
                var result = [];
            } else {
                var result = [{
                        value: -1,
                        label: $translate('FORM.ASK_ME')
                    }];
            }

            if ($sex !== 0 && $sex !== 1) {
                min = 0;
                max = 15;
            } else {
                min = confBodyType[$sex][0];
                max = confBodyType[$sex][1];
            }
            for (var i = 0; i < body_type.length; i++) {
                if (body_type[i].value >= min && body_type[i].value <= max) {
                    result.push(body_type[i]);
                }
            }
            $scope.properties.body_type = result;
            if ($body_type === undefined) {
                $scope.user.body_type = null;
            }
            return result;
        };

        $scope.is_show_field_when_is_female = false;
        $scope.properties = {
            user_type: $app.labels.get('userTypes'),
            flags: $app.labels.get('userStatuses'),
            gender: $app.labels.get('genders'),
            region: $app.labels.get('region', true),
            is_purchase: $app.labels.get('isPurchase').splice(1, 2),
            cup: $app.labels.get('cup'),
            cute_type: $app.labels.get('cuteType'),
            join_hours: $app.labels.get('joinHours'),
            job: job,
            body_type: body_type,
            verification_flag: $app.labels.get('verificationFlag'),
            video_call_waiting: $app.labels.get('videoCallWaiting'),
            voice_call_waiting: $app.labels.get('videoCallWaiting'),
            site_id: $app.labels.get('site_id'),
            action_detail_user: $app.labels.get('actionOnDetailUser'),
            eazy_alt: [
                {
                    value: 0,
                    label: $translate('FORM.OFF')
                }, {
                    value: 1,
                    label: $translate('FORM.ON')
                }],
            noti_buzz: [
                {
                    value: 0,
                    label: $translate('FORM.OFF')
                }, {
                    value: 1,
                    label: $translate('FORM.ON')
                }],
            noti_chat: [
                {
                    value: -1,
                    label: $translate('FORM.NONE')
                }, {
                    value: 0,
                    label: $translate('FORM.ALL')
                }, {
                    value: 1,
                    label: $translate('FORM.ONLY_FAVORITE')
                }],
            cm_code: new Array
        };

        var token = Session.getAuthority().token;

        API.call({
            api: 'get_all_cm_code',
            token: token
        }).then(function (data) {
            angular.forEach(data, function (value, key) {
                $scope.properties.cm_code[key] = {value: value, label: value};
            });
        }, function (errorCode) {
            Dialog.error(errorCode);
        });

        $scope.divwrap = '#main-body';

        $scope.user = {
            measurements: new Array,
            region: $scope.properties.region[0].value,
            job: $scope.properties.job[0].value,
            body_type: $scope.properties.body_type[0].value,
            site_id: $scope.properties.site_id[0].value,
            action_detail_user: $scope.properties.action_detail_user[0].value
        };

        // function
        $scope.selectAction = function () {
            switch ($scope.user.action_detail_user) {
                case "":
                    break;
                case CREATE_AUTO_NOTIFICATION:
                    $scope.createNotification();
                    break;
                case CREATE_NEW_LOGIN:
                    $scope.createNewsLogin();
                    break;
                case CREATE_AUTO_MESSAGE:
                    $scope.createAutoMessage();
                    break;
                case ADD_POINT:
                    $scope.addPointList();
                    break;
                case CREATE_CONTACT:
                    $scope.createContact();
                    break;
                default:
                    break;
            }
        };

        $scope.createAutoMessage = function () {
            $location.path('/user/auto_message_create').search({
                data: angular.toJson(gatherCriteria())
            });
        };

        $scope.createNotification = function () {
            $location.path('/user/auto_notification_create').search({
                data: angular.toJson(gatherCriteria())
            });
        };

        $scope.createNewsLogin = function () {
            $location.path('/user/create_news_login').search({
                data: angular.toJson(gatherCriteria())
            });
        };

        $scope.createContact = function () {
            $location.path('/user/contact_create').search({
                data: angular.toJson(gatherCriteria())
            });
        };

        $scope.addPointList = function () {
            $modal.open({
                templateUrl: 'partials/add_point_list.html',
                controller: AddPointListCtrl,
                resolve: {
                    data_search: function () {
                        return gatherCriteria();
                    },
                    services: function () {
                        return {
                            API: API,
                            Dialog: Dialog,
                            Session: Session
                        };
                    }
                }
            });
        };

        var gatherCriteria = function () {
            var criteria = {
                id: $scope.user.user_id
            };

            return criteria;
        };

        var AddPointListCtrl = function ($scope, $modalInstance, data_search, services) {
            $scope.input = {
                amount: null
            };
            $scope.close = function () {
                $modalInstance.close();
            };

            $scope.addPoint = function () {
                //console.log($app.authority.name);
                var params = angular.copy(data_search);

                params.api = 'add_point_by_list';
                params.token = Session.getAuthority().token;
                params.added_point = parseIntNullable($scope.input.amount);
                params.admin_name = $app.authority.name;
                API.call(params).then(function () {
                    $modalInstance.close();
                }, function (code) {
                    Dialog.error(code);
                });
            };
        };

        $scope.searchUserID = function () {
            window.location.href = "#/user/user_detail/" + jQuery("#input-user-id").val().trim();
        };
        
        // Load first
        API.call({
            api: 'detail_user',
            token: token,
            id: userId
        }).then(function (data) {
            $scope.properties['job'] = $scope.getJob(data.gender, data.job);
            $scope.properties['body_type'] = $scope.getBodyType(data.gender, data.body_type);
            if (data.gender === 1 && data.finish_register_flag === 1) {
                $scope.properties['region'] = $scope.user.region !== null ? $app.labels.get('region') : $app.labels.get('region', true);
            }
            
            $scope.user.ava_id = null; 
            
            for (var key in data) {
                $scope.user[key] = data[key];
            }
            //If user_type = 0 || 1 then server return all : email, fb_id => need to refactor.
            $scope.user.fb_id = $scope.user.email;
            $scope.user.mocom_id = $scope.user.email;
            $scope.user.famu_id = $scope.user.email;

            // Validate point and price number allway > 0
            if ($scope.user.total_purchase_user_detail < 0) {
                $scope.user.total_purchase_user_detail = 0;
            }
            if ($scope.user.total_purchase_apple < 0) {
                $scope.user.total_purchase_apple = 0;
            }
            if ($scope.user.total_purchase_google < 0) {
                $scope.user.total_purchase_google = 0;
            }
            if ($scope.user.total_purchase_credit_card < 0) {
                $scope.user.total_purchase_credit_card = 0;
            }
            if ($scope.user.total_purchase_bitcach < 0) {
                $scope.user.total_purchase_bitcach = 0;
            }
            if ($scope.user.total_purchase_convenience < 0) {
                $scope.user.total_purchase_convenience = 0;
            }
            if ($scope.user.total_purchase_points_back < 0) {
                $scope.user.total_purchase_points_back = 0;
            }
            if ($scope.user.total_purchase_points_ccheck < 0) {
                $scope.user.total_purchase_points_ccheck = 0;
            }

            //$scope.user = data;
            $scope.firstUser = angular.copy($scope.user);
            $scope.is_show_field_when_is_female = $scope.user.gender == "1" ? true : false;
            $scope.user.localBirthday = LocalTime.from($scope.user.bir, true);

            if ($scope.user.ava_id !== null) {
                $scope.user.$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
                        + '&img_id=' + $scope.user.ava_id + '&img_kind=2';    
            } else {
                $scope.user.ava_id  = 'none';
                $scope.user.$imgSrc = 'img/no_image_200_200.jpg';
            }
            
            $scope.check($scope.user.gender, $scope.user.finish_register_flag);
            $scope.checkRequire();
        }, function (errorCode) {
            //#11769
            if(errorCode == 80){
                Dialog.alert({
                    title: $translate('DIALOG.ERROR_TITLE'),
                    message: $translate('USER.SEARCH_RESULT.USER_NOT_EXIST')
                })
            }else{
                Dialog.error(errorCode);
            }
        });


        $scope.check_full_three_value = function () {
            var configMeasurements = [40, 30, 30];   //[minBust,minWaist,minHips]
            if ($scope.user['measurements'].length < 3 && $scope.user['measurements'].length >= 1) {
                for (var i = 0; i < 3; i++) {
                    if ($scope.user['measurements'][i] == null || $scope.user['measurements'][i] == "") {
                        $scope.user['measurements'][i] = configMeasurements[i];
                    }
                }
            }
        };

        $scope.update = function () {
            var has_error = 0;
            var selectUserType = {
                0: "email",
                1: "fb_id",
                2: "mocom_id",
                3: "famu_id"
            };

            //  (key : value) : key : key is key of params (server return this key : params[key]), value : is key of scope.user[value]
            var check_change_to_null = {
                fetish: 'fetish',
                memo: 'memo',
                type_of_man: 'type_of_man',
                hobby: 'hobby'
            };
            var params = {
                api: 'upd_user_inf_by_admin',
                token: token,
                req_user_id: userId,
                user_name: $scope.user.user_name,
                abt: $scope.user.abt,
                del_abt: $scope.user.abt === '' ? 1 : 0,
                bir: $scope.user.localBirthday.time.local(LocalTime.formats.yyyyMMdd),
                gender: $scope.user.gender,
                flag: parseIntNullable($scope.user.flag),
                region: parseIntNullable($scope.user.region),
                is_purchase: parseIntNullable($scope.user.is_purchase),
                cup: parseIntNullable($scope.user.cup),
                cute_type: parseIntNullable($scope.user.cute_type),
                join_hours: parseIntNullable($scope.user.join_hours),
                job: $scope.user.job === '' ? null : parseIntNullable($scope.user.job),
                body_type: $scope.user.body_type === '' ? null : parseIntNullable($scope.user.body_type),
                site_id: $scope.user.site_id,
                memo: $scope.user.memo,
                fetish: $scope.user.fetish,
                type_of_man: $scope.user.type_of_man,
                measurements: $scope.user.measurements,
                hobby: $scope.user.hobby,
                point: $scope.user.point,
                verification_flag: $scope.user.verification_flag,
                video_call_waiting: $scope.user.video_call_waiting,
                voice_call_waiting: $scope.user.voice_call_waiting,
                cm_code: $scope.user.cm_code
            };
            params[selectUserType[$scope.user.user_type]] = $scope.user[selectUserType[$scope.user.user_type]];

            if ($scope.is_show_field_when_is_female === false) {
                params.cup = null;
                params.join_hours = null;
                params.measurements = null;
            }

            /*
             * Check mesurements is null
             */
            if (params.measurements && params.measurements[0] === null && params.measurements[1] === null && params.measurements[2] === null) {
                params.measurements = null;
            }
            for (var key in check_change_to_null) {
                if ($scope.firstUser[key]) {
                    if ($scope.firstUser[key] !== params[key] && (params[key] == "")) {
                        params[key] = ' ';
                    }
                }
            }

            $scope.checkRequire();
            if ($scope.checkHasError()) {
                has_error++;
            }

            if (has_error !== 0) {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('DIALOG.ERROR_TITLE')
                });
                return false;
            }

            API.call(params).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('USER.USER_DETAIL.MESS_UPDATEUSER_CONTENT')
                });
                $scope.user.showError = {};
            }, function (errorCode) {
                errorProcess($translate, Dialog, errorCode, $scope.user);
            });
        };

        $scope.searchDeviceId = function (device_id) {
            $location.path('/user').search({
                data: angular.toJson(device_id)
            });
        };

        $scope.paymentHistory = function () {
            $modal.open({
                templateUrl: 'partials/user_payment_history.html',
                controller: PaymentHistoryModal,
                windowClass: 'window-class-style',
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            });
        };

        $scope.totalPurchase = function (product_type) {
            $scope.user.product_type = product_type;
            $modal.open({
                templateUrl: 'partials/user_purchase_total.html',
                controller: PurchaseTotalModal,
                windowClass: 'window-class-style',
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            });
        };

        $scope.totalPoints = function () {
            // $scope.user.is_total_point = true;
            $modal.open({
                templateUrl: 'partials/user_point_total.html',
                controller: PointHistoryModal,
                windowClass: 'window-class-style',
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            });
        };

        $scope.viewPoint = function () {
            $modal.open({
                templateUrl: 'partials/user_point_history.html',
                controller: PointHistoryModal,
                windowClass: 'window-class-style',
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            });
        };

        var calculatorTotalPoint = function (amount) {
            if (angular.isUndefined(amount)) {
                return false;
            }
            var data = amount.split(" ");
            var price = data[0];
            var point = data[1];
            var productType = parseInt(data[2]);

            if (isSet(price) && !isNaN(price)) {
                $scope.user.total_purchase_user_detail += parseInt(price, 10);
                switch (productType) {
                    case 0:
                        $scope.user.total_purchase_apple += parseInt(price, 10);
                        break;
                    case 1:
                        $scope.user.total_purchase_google += parseInt(price, 10);
                        break;
                    case 2:
                        $scope.user.total_purchase_credit_card += parseInt(price, 10);
                        break;
                    case 3:
                        $scope.user.total_purchase_bitcach += parseInt(price, 10);
                        break;
                    case 4:
                        $scope.user.total_purchase_convenience += parseInt(price, 10);
                        break;
                    case 5:
                        $scope.user.total_purchase_points_back += parseInt(price, 10);
                        break;
                    case 6:
                        $scope.user.total_purchase_points_ccheck += parseInt(price, 10);
                }
            }

            if (isSet(point) && !isNaN(point)) {
                $scope.user.point += parseInt(point, 10);
            }
            if ($scope.user.point < 0) {
                $scope.user.point = 0;
            }
            if ($scope.user.total_purchase_points_ccheck < 0) {
                $scope.user.total_purchase_points_ccheck = 0;
            }
            if ($scope.user.total_purchase_points_back < 0) {
                $scope.user.total_purchase_points_back = 0;
            }
            if ($scope.user.total_purchase_convenience < 0) {
                $scope.user.total_purchase_convenience = 0;
            }
            if ($scope.user.total_purchase_bitcach < 0) {
                $scope.user.total_purchase_bitcach = 0;
            }
            if ($scope.user.total_purchase_credit_card < 0) {
                $scope.user.total_purchase_credit_card = 0;
            }
            if ($scope.user.total_purchase_google < 0) {
                $scope.user.total_purchase_google = 0;
            }
            if ($scope.user.total_purchase_apple < 0) {
                $scope.user.total_purchase_apple = 0;
            }
            if ($scope.user.total_purchase_user_detail < 0) {
                $scope.user.total_purchase_user_detail = 0;
            }
        };

        $scope.addPurchasePoint = function () {
            $modal.open({
                templateUrl: 'partials/add_purchase_point.html',
                controller: AddPurchasePointModal,
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            }).result.then(function (amount) {
                calculatorTotalPoint(amount);
            });
        };

        $scope.reducePoint = function () {
            $modal.open({
                templateUrl: 'partials/add_reduce_point.html',
                controller: AddPurchasePointModal,
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            }).result.then(function (amount) {
                calculatorTotalPoint(amount);
            });
        };

        $scope.addPoint = function () {
            $modal.open({
                templateUrl: 'partials/add_point.html',
                controller: AddPointModal,
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            }).result.then(function (amount) {
                if (isSet(amount) && !isNaN(amount) && amount !== 0) {
                    $scope.user.point += parseInt(amount, 10);

                    if ($scope.user.point < 0) {
                        $scope.user.point = 0;
                    }
                }
            });
        };

        $scope.resetPassword = function (userId) {
            $modal.open({
                templateUrl: 'partials/reset_password.html',
                controller: ResetPassword,
                resolve: {
                    data: function () {
                        return $scope.user;
                    }
                }
            }).result.then(function (password) {
                if (password) {
                    $scope.user.original_pwd = password;
                }
            });
        };

        $scope.close = function () {
            $modalInstance.close();
        };

        /*
         * Logical here
         */
        $scope.setRequire = {};
        $scope.error = {};
        $scope.$watch(function () {
            return $scope.user['gender'];
        }, function (newValue) {
//    $scope.properties['job'] = $scope.getJob(newValue);
            $scope.is_show_field_when_is_female = newValue == "1" ? true : false;
        });

        /*
         *
         * @returns {undefined}
         * check all user and return error if has
         */
        $scope.checkRequire = function () {
            for (var key in $scope.user) {
                if ($scope.setRequire[key] && ($scope.user[key] === null)) {
                    $scope.error[key] = true;
                } else {
                    $scope.error[key] = false;
                }
            }
        };

        /*
         * checkHasError
         * @param {type} $scope.error
         * @returns {true,false}
         */
        $scope.checkHasError = function () {
            var totalError = 0;
            for (var key in $scope.error) {
                if ($scope.setRequire[key] && $scope.setRequire[key] == true && $scope.error[key] == true) {
                    return true;
                }
            }
            return false;
        };

        $scope.check = function (gender, finish_register_flag) {
            for (var key in $scope.user) {
                $scope.setRequire[key] = false;
            }
//    $scope.setRequire['mail'] = $scope.firstUser['mail'] !== null ? true : false;
            if (gender == "0" && finish_register_flag == 0) {   //Male
                $scope.setRequire['region'] = false;
            } else if (gender == "0" && finish_register_flag == 1) {
                $scope.setRequire['user_name'] = true;
                $scope.setRequire['region'] = false;
            } else if (gender == "1" && finish_register_flag == 0) {    //FeMale
                $scope.setRequire['user_name'] = false;
                $scope.setRequire['region'] = false;
                $scope.setRequire['job'] = false;
                $scope.setRequire['body_type'] = false;
                $scope.setRequire['type_of_man'] = false;
                $scope.setRequire['fetish'] = false;
                $scope.setRequire['abt'] = false;
                $scope.setRequire['join_hours'] = false;
                $scope.setRequire['cup'] = false;
                $scope.setRequire['cute_type'] = false;
                $scope.setRequire['measurement'] = false;
            } else if (gender == "1" && finish_register_flag == 1) {
                $scope.setRequire['user_name'] = true;
                $scope.setRequire['region'] = true;
                $scope.setRequire['job'] = $scope.firstUser['job'] !== null ? true : false;
                $scope.setRequire['body_type'] = $scope.firstUser['body_type'] !== null ? true : false;
                $scope.setRequire['type_of_man'] = $scope.firstUser['type_of_man'] !== null ? true : false;
                $scope.setRequire['fetish'] = false;
                $scope.setRequire['abt'] = false;
                $scope.setRequire['join_hours'] = true;
                $scope.setRequire['cup'] = $scope.firstUser['cup'] !== null ? true : false;
                $scope.setRequire['cute_type'] = $scope.firstUser['cute_type'] !== null ? true : false;
                $scope.setRequire['measurement'] = true;
            }
        };
        /*
         * Logical : check purchase
         */
        $scope.$watch(function () {
            return $scope.user['is_purchase'];
        }, function (newValue) {
            $scope.is_show_money_pur_day = newValue == "1" ? true : false;
        });

        /*
         * Logic Bussiness
         */
    };

    var PurchaseTotalModal = function ($scope, $q, $injector, $modal, $modalInstance, $translate, $sce, API, Session, Dialog, data) {
        $scope.user = data;
        $scope.close = function () {
            $modalInstance.close();
        };
        var productionTypeTemp;

        if (angular.isUndefined($scope.user.product_type)) {
            productionTypeTemp = -1;
        } else {
            productionTypeTemp = $scope.user.product_type;
        }
        $scope.attributes = {
            productionTypes: $app.labels.get('production_type'),
            productionTypeDialog: $app.labels.get('production_type_dialog'),
            purchaseSuccess: [{
                    value: 0,
                    label: $translate('FORM.NO')
                }, {
                    value: 1,
                    label: $translate('FORM.YES')
                }]
        };
        API.call({
            api: 'view_total_price',
            token: Session.getAuthority().token,
            production_type: $scope.user.product_type,
            id: $scope.user.user_id
        }).then(function (data) {
            $scope.user.total_purchase = data.totalPrice;
            $scope.purchaseLog = data.list;
            $scope.user.production_type = productionTypeTemp;
        }, function (code) {
            Dialog.error(code);
        });
    };

    var PaymentHistoryModal = function ($scope, $q, $injector, $modal, $modalInstance, $translate, $sce, API, Session, Dialog, data) {
        $scope.user = data;
        $scope.close = function () {
            $modalInstance.close();
        };
        API.call({
            api: 'get_money_trade_from_point',
            token: Session.getAuthority().token,
            id: $scope.user.user_id
        }).then(function (data) {
            $scope.paymentHistory = data.list;
        }, function (code) {
            Dialog.error(code);
        });
    };

    var PointHistoryModal = function ($scope, $q, $injector, $modal, $modalInstance, $translate, $sce, API, Session, Dialog, data) {
        $scope.reasons = $app.labels.get('logReasons');
        $scope.user = data;
        //#11804
        const DEFAULT_ITEM = 50;
        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: DEFAULT_ITEM, //$app.pageSize, // each page have 50 items 
            currentPage: 1,
            totalItems: 0,
            loadingFlag: 0
        };
        $scope.close = function () {
            $modalInstance.close();
        };

        var api_point_log = "lst_log_pnt";
        if ($scope.user.is_total_point == true) {
            api_point_log = "view_total_point";
            $scope.user.is_total_point = false;
        }
        //Call api to get options of FREE POINT select
        $scope.load = function (page) {
            $scope.setting.loadingFlag = 1;
            var reqSearchPointHistory = {
                api: api_point_log,
                id: $scope.user.user_id,
                token: Session.getAuthority().token,
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage,
            }
            API.call(reqSearchPointHistory).then(function (data) { 
                $scope.setting.totalItems = data.total;
                if (data.totalPoint) {
                    $scope.user.total_point = data.totalPoint;
                }
                for (var i in data.list) {
                    data.list[i].isSetPartnerId = false;

                    if (data.list[i].type === 41) {
                        //if is add point free
                        var logReasons = $scope.freePoints;
                        for (var j in logReasons) {
                            if (logReasons[j].free_point_number === data.list[i].free_point_type) {
                                data.list[i].isSetPartnerId = true;
                                data.list[i].type = $sce.trustAsHtml($translate('LOG.POINT.SELECT.ADD_FREE_POINT_FROM_XXX', {name: logReasons[j].free_point_name}));
                            }
                        }
                    } else if (data.list[i].type === 42) {
                        //if is add point free  
                        var saleTypes = $app.labels.get('saleType');
                        for (var j in saleTypes) {
                            if (saleTypes[j].value === data.list[i].sale_type) {
                                data.list[i].isSetPartnerId = true;
                                data.list[i].type = $sce.trustAsHtml($translate('LOG.POINT.SELECT.ADD_POINT_BY_XXX', {name: saleTypes[j].label}));
                            }
                        }
                    } else if (data.list[i].type === 14 || data.list[i].type === 49) {
                        var logReasons = $app.labels.get('logReasons');
                        for (var j in logReasons) {
                            if (logReasons[j].value === data.list[i].type && !isUnset(logReasons[j].name)) {
                                data.list[i].isSetPartnerId = true;
                                data.list[i].type = $sce.trustAsHtml($translate(logReasons[j].name, {name: '<a>' + data.list[i].partner_name + '</a>'}));
                            }
                        }
                    } else if (data.list[i].type === 22) {
                        var html = '<a class="btn-link" href="#/user/user_detail/' + data.list[i].partner_id + '" target="_blank">' + data.list[i].partner_name + '</a>';
                        var logReasons = $app.labels.get('logReasons');
                        for (var j in logReasons) {
                            if (logReasons[j].value === data.list[i].type && !isUnset(logReasons[j].name)) {
                                data.list[i].isSetPartnerId = true;
                                data.list[i].type = $sce.trustAsHtml($translate(logReasons[j].name, {name: html}));
                            }
                        }
                    } else {
                        var html = '<a class="btn-link" href="#/user/user_detail/' + data.list[i].partner_id + '" target="_blank">' + data.list[i].partner_name + '</a>';
                        if (data.list[i].is_Admin === 1) {
                            html = '<a class="btn-link">' + data.list[i].partner_name + '</a>';
                        }
                        var logReasons = $app.labels.get('logReasons');
                        for (var j in logReasons) {
                            if (logReasons[j].value === data.list[i].type && !isUnset(logReasons[j].name)) {
                                data.list[i].isSetPartnerId = true;
                                data.list[i].type = $sce.trustAsHtml($translate(logReasons[j].name, {name: html}));
                            }
                        }
                    }
                }
                $scope.pointLog = data.list;
            }, function (errorCode) {
                Dialog.error(errorCode).then(function () {
                    $scope.close();
                });
            });
        };
        $scope.load(1);
    };

    PointHistoryModal.$inject = ['$scope', '$q', '$injector', '$modal', '$modalInstance', '$translate', '$sce', 'API', 'Session', 'Dialog', 'data'];

    var AddPurchasePointModal = function ($scope, $q, $translate, $injector, $modalInstance, API, Session, Dialog, data) {
        $scope.user = data;
        $scope.input = {};
        $scope.property = {
            production_type: $app.labels.get('production_type')
        };
        $scope.input = {
            production_type: $scope.property.production_type[0].value
        };

        $scope.close = function () {
            $modalInstance.close();
        };

        var showDialogValidate = function (title, description) {
            Dialog.alert({
                title: $translate(title),
                message: $translate(description)
            });
        };

        $scope.addPurchasePoint = function () {
            var valPrice = parseIntNullable($scope.input.price);
            var valPoint = parseIntNullable($scope.input.point);
            var valProductType = parseIntNullable($scope.input.production_type);

            var totalPurchaseApple = parseIntNullable($scope.user.total_purchase_apple);
            var totalPurchaseGoogle = parseIntNullable($scope.user.total_purchase_google);
            var totalPurchaseCredit = parseIntNullable($scope.user.total_purchase_credit_card);
            var totalPurchaseBitcach = parseIntNullable($scope.user.total_purchase_bitcach);
            var totalPurchaseConvenience = parseIntNullable($scope.user.total_purchase_convenience);
            var totalPurchasePointback = parseIntNullable($scope.user.total_purchase_points_back);
            var totalPurchaseCCheck = parseIntNullable($scope.user.total_purchase_points_ccheck);
            var totalPurchasePoint = parseIntNullable($scope.user.point);

            if ($scope.input.isAdded === false) {
                switch (valProductType) {
                    case 0:
                        if (valPrice > totalPurchaseApple) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                    case 1:
                        if (valPrice > totalPurchaseGoogle) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                    case 2:
                        if (valPrice > totalPurchaseCredit) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                    case 3:
                        if (valPrice > totalPurchaseBitcach) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                    case 4:
                        if (valPrice > totalPurchaseConvenience) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                    case 5:
                        if (valPrice > totalPurchasePointback) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                    case 6:
                        if (valPrice > totalPurchaseCCheck) {
                            showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_PRICE_ERROR");
                            return false;
                        }
                        break;
                }

                if (valPoint > totalPurchasePoint) {
                    showDialogValidate("DIALOG.WARNING_TITLE", "DIALOG.CONTENT_VALIDATE_POINT_ERROR");
                    return false;
                }

                valPrice = valPrice * -1;
                valPoint = valPoint * -1;
            }
            var amount = valPrice + " " + valPoint + " " + valProductType;
            API.call({
                api: 'add_purchase_by_admin',
                token: Session.getAuthority().token,
                price: valPrice,
                point: valPoint,
                production_type: valProductType,
                id: $scope.user.user_id,
                admin_name: $app.authority.name
            }).then(function () {
                $modalInstance.close(amount);
            }, function (code) {
                Dialog.error(code);
            });
        };
    };

    AddPurchasePointModal.$inject = ['$scope', '$q', '$translate', '$injector', '$modalInstance', 'API', 'Session', 'Dialog', 'data'];

    var AddPointModal = function ($scope, $q, $injector, $modalInstance, API, Session, Dialog, data) {
        $scope.user = data;
        $scope.input = {
            untradable_amount: 0,
            tradable_amount: 0
        };
        $scope.close = function () {
            $modalInstance.close();
        };

        $scope.addPoint = function () {
            var amount = parseIntNullable($scope.input.amount);
            API.call({
                api: 'add_point',
                token: Session.getAuthority().token,
                id: $scope.user.user_id,
                point: amount,
                admin_name: $app.authority.name
            }).then(function () {
                $modalInstance.close(amount);
            }, function (code) {
                Dialog.error(code);
            });
        };
    };

    AddPointModal.$inject = ['$scope', '$q', '$injector', '$modalInstance', 'API', 'Session', 'Dialog', 'data'];

    var ResetPassword = function ($scope, $q, $injector, $modalInstance, $translate, API, Session, Dialog, data) {
        var userId = data.user_id;
        var token = Session.getAuthority().token;
        $scope.input = {};

        $scope.changePassword = function () {
            if ($scope.input.newPassword !== $scope.input.confirmNewPassword) {
                Dialog.alert({
                    title: $translate('DIALOG.WARNING_TITLE'),
                    message: $translate('CHANGE_PASSWORD.PASSWORD_NOT_MATCHED')
                }).then(function () {
                    $('#confirm').focus();
                });
            } else {
                var reqDataResetPassword = {
                    api: 'reset_pwd',
                    token: token,
                    id: userId,
                    original_pwd: isUnset($scope.input.newPassword) || $scope.input.newPassword.toString().length === 0 ? undefined : $scope.input.newPassword.toString(),
                    pwd: isUnset($scope.input.newPassword) || $scope.input.newPassword.toString().length === 0 ? undefined : SHA1($scope.input.newPassword)
                };

                API.call(reqDataResetPassword).then(function () {
                    Dialog.alert({
                        title: $translate('DIALOG.INFO_TITLE'),
                        message: $translate('USER.USER_DETAIL.MESS_UPDATE_PASS')
                    }).then(function () {
                        $modalInstance.close($scope.input.newPassword);
                    });
                }, function (errorCode) {
                    errorProcess($translate, Dialog, errorCode, $scope.input);
                });
            }
        };

        $scope.close = function () {
            $modalInstance.close();
        };
    };

    ResetPassword.$inject = ['$scope', '$q', '$injector', '$modalInstance', '$translate', 'API', 'Session', 'Dialog', 'data'];

    var messageDataHandle = {
        4: {
            control: '#age',
            name: 'age',
            message: 'USER.USER_DETAIL.MESS_UPDATE_AGE_ERROR'
        },
        5: {
            control: '#height',
            name: 'height',
            message: 'USER.USER_DETAIL.MESS_UPDATE_HEIGHT_ERROR'
        },
        6: {
            control: '#userName',
            name: 'userName',
            message: 'USER.USER_DETAIL.MESS_UPD_USER_NAME_LENGTH_ERROR'
        },
        7: {
            control: '#about',
            name: 'about',
            message: 'USER.USER_DETAIL.MESS_UPD_ABOUT_LENGTH_ERROR'
        },
        11: {
            control: '#email',
            name: 'email',
            message: 'USER.USER_DETAIL.MESS_INVALID_EMAIL'
        },
        12: {
            control: '#email',
            name: 'email',
            message: 'USER.USER_DETAIL.MESS_UPDATE_EMAIL_ERROR'
        },
        14: {
            control: '#userName',
            name: 'userName',
            message: 'USER.USER_DETAIL.MESS_UPDATE_USER_NAME_ERROR'
        },
        21: {
            control: '#password',
            name: 'password',
            message: 'USER.USER_DETAIL.MESS_UPDATE_PASS_ERROR'
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

    /* create controller userctrl */
    UserDetailCtrl.$inject = ['$scope', '$location', '$q', '$routeParams', '$modal', '$translate', 'API', 'Dialog', 'Session'];
    $app.controllers.controller('UserDetailCtrl', UserDetailCtrl);
})();