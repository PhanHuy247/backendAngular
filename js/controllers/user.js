(function () {
    var UserCtrl = function ($scope, $routeParams, $location, $translate, $modal, API, CSV, Session, Dialog) {
        window.userscope = $scope;
        var CREATE_AUTO_NOTIFICATION = 0;
        var CREATE_NEW_LOGIN = 1;
        var CREATE_AUTO_MESSAGE = 2;
        var ADD_POINT = 3;
        var CREATE_CONTACT = 4;
        // ========== get body type by male or female ==========
        var body_type = $app.labels.get('body_type');
        var getBodyTypes= function ($sex) {
            $sex = parseIntNullable($sex);
            var confBodyType = {
                1: [0, 7], //female
                0: [8, 15] //male
            };
            var min = confBodyType[0][0];
            var max = confBodyType[0][1];
            var result = [];
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
            return result;
        };
        // ========== get job by male or female ==========
        var job = $app.labels.get('job');
        var getJob = function ($sex) {
            $sex = parseIntNullable($sex);
            var confJob = {
                1: [0, 16], //female
                0: [17, 38] //male
            };
            var min = confJob[0][0];
            var max = confJob[0][1];
            var result = [];
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
            return result;
        };
        // ========== setting ==========
        $scope.setting = {
            currentPage: 1,
            pageDisplay: $app.pageDisplay,
            pageSize: $app.pageSize,
            total: 0
        };
        var device_id = angular.fromJson($routeParams.data);
        $scope.property = {
            user_type: $app.labels.get('userTypes', true),
            cup: $app.labels.get('cup'),
            flags: $app.labels.get('userStatuses', true),
            interes: $app.labels.get('interests'),
            gender: $app.labels.get('genders', true),
            device_type: $app.labels.get('deviceType', true),
            //#11751
            sort: $app.labels.get('sortBy'),
            profile_image:$app.labels.get('profileImage'),
            btn_action: $app.labels.get('actionOnDetailUser'),
            order: $app.labels.get('orderBys'),
            is_purchase: $app.labels.get('isPurchase'),
            cute_type: $app.labels.get('cuteType'),
            join_hours: $app.labels.get('joinHours'),
            job: getJob(),
            region: $app.labels.get('region'),
            body_type: getBodyTypes(), //thêm body_type
            cm_code: "",
            application: $app.labels.get('listApplicationID', true)
        };
        $scope.rate = 5;
        $scope.isReadonly = false;
        $scope.input = {
            user_type: $scope.property.user_type[0].value,
            flags: $scope.property.flags[0].value,
            gender: $scope.property.gender[0].value,
            device_type: $scope.property.device_type[0].value,
            profile_image: $scope.property.profile_image[0].value,
            sort: $scope.property.sort[$scope.property.sort.length - 1].value,
            btn_action: $scope.property.btn_action[0].value,
            order: -1,
            is_purchase: $scope.property.is_purchase[0].value,
            upper_pnt: null,
            lower_pnt: null,
            //            user_total_purchase_from: null,
            //            user_total_purchase_to: null,
            //            user_total_point_from: null,
            //            user_total_point_to: null,
            lower_age: null,
            upper_age: null,
            relsh_stt: new Array,
            cup: new Array,
            cute_type: new Array,
            join_hours: new Array,
            job: new Array,
            region: new Array,
            body_type: new Array,
            application: $scope.property.application[0].value
        };

        var token = Session.getAuthority().token;
        var reqCmCode = {
            api: 'get_all_cm_code',
            token: token
        };
        API.call(reqCmCode).then(function (data) {
            $scope.cm_code_size = data.length;
            angular.forEach(data, function (value, key) {
                $scope.property.cm_code[key + 1] = {
                    value: key + 1,
                    label: value
                };
            });
            $scope.property.cm_code[0] = {
                value: 0,
                label: "Select All"
            };
        }, function (errorCode) {
            Dialog.error(errorCode);
        });
        //Logical here
        $scope.$watch(function () {
            return $scope.input['gender'];
        }, function (newValue) {
            $scope.property['job'] = getJob(newValue);
            $scope.property['body_type'] = getBodyTypes(newValue);
            $scope.is_show_field_when_is_female = newValue == "1" ? true : false;
        });

        $scope.$watch(function () {
            return $scope.input['is_purchase'];
        }, function (newValue) {
            $scope.is_show_money_pur_day = newValue;
            $scope.is_show_money_pur_day = newValue == "1" ? true : false;
        });
        $scope.$watch(function () {
            return $scope.input['sort'];
        }, function (newValue) {
            $scope.input.order = newValue == 5 ? -1 : 1;
        });

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.beginSearch = function () {
            $scope.setting.currentPage = 1;
            $scope.setting.total = 0;
            $scope.search($scope.setting.currentPage);
        };

        $scope.show_when_total_larger_one = false;
        $scope.search = function (page) {
            var criteria = gatherCriteria();
            var params = angular.copy(criteria);
            params.api = 'search_user';
            params.token = token;
            params.sort = $scope.input.sort;
            params.order = parseIntNullable($scope.input.order);
            params.skip = $scope.setting.pageSize * (page - 1);
            params.take = $scope.setting.pageSize;

            API.call(params).then(function (data) {
                console.log('------ dl trả về --------');
                console.log(data);
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);

                var totalData = data.total;
                $scope.setting.total = totalData;
                $scope.userList = data.list;

                if (totalData > 1) {
                    $scope.show_when_total_larger_one = true; // Show block push when total data > 1
                } else {
                    $scope.show_when_total_larger_one = false; // Hide block push when total data > 1
                }
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        var gatherCriteria = function () {
            if ($scope.input.user_type === $scope.property.user_type[0].value) {
                $scope.input.email = null;
            }

            var criteria = {
                user_type: parseIntNullable($scope.input.user_type),
                email: $scope.input.email,
                user_name: $scope.input.user_name,
                gender: parseIntNullable($scope.input.gender),
                device_type: parseIntNullable($scope.input.device_type),
                profile_image: parseIntNullable($scope.input.profile_image),
                id: $scope.input.user_id,
                lower_pnt: parseIntNullable($scope.input.lower_pnt),
                upper_pnt: parseIntNullable($scope.input.upper_pnt),
                //                user_total_purchase_from: parseIntNullable($scope.input.user_total_purchase_from),
                //                user_total_purchase_to: parseIntNullable($scope.input.user_total_purchase_to),
                //                user_total_point_from: parseIntNullable($scope.input.user_total_point_from),
                //                user_total_point_to: parseIntNullable($scope.input.user_total_point_to),
                lower_bir: new LocalTime($scope.input.lower_bir).toString(),
                upper_bir: new LocalTime($scope.input.upper_bir).endOfDay().toString(),
                flag: $scope.input.flags == null ? null : $scope.input.flags,
                //cm_code : getCmCodeValue($scope.input.cm_code),
                cm_code: $scope.input.cm_code,
                device_id: $scope.input.device_id,
                from_reg_day: new LocalTime($scope.input.from_reg_day).toString(),
                to_reg_day: new LocalTime($scope.input.to_reg_day).endOfDay().toString(),
                last_from_pur_day: new LocalTime($scope.input.last_from_pur_day).toString(),
                last_to_pur_day: new LocalTime($scope.input.last_to_pur_day).endOfDay().toString(),
                from_pur_day: new LocalTime($scope.input.from_pur_day).toString(),
                to_pur_day: new LocalTime($scope.input.to_pur_day).endOfDay().toString(),
                from_login_day: new LocalTime($scope.input.from_login_day).toString(),
                to_login_day: new LocalTime($scope.input.to_login_day).endOfDay().toString(),
                cup: $scope.input.cup,
                cute_type: $scope.input.cute_type,
                join_hours: $scope.input.join_hours,
                job: $scope.input.job,
                is_purchase: parseIntNullable($scope.input.is_purchase),
                from_money: parseIntNullable($scope.input.from_money),
                to_money: parseIntNullable($scope.input.to_money),
                region: $scope.input.region,
                body_type: $scope.input.body_type,
                application: parseIntNullable($scope.input.application),
                phone_number: $scope.input.phone_number
            };
            console.log('========= dl gửi lên =========');
            console.log(criteria);

            return criteria;
        };

        if (device_id) {
            $scope.input.device_id = device_id;
            $scope.beginSearch();
        }

        $scope.selectAction = function () {
            switch ($scope.input.btn_action) {
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

        $scope.exportCSV = function () {
            var criteria = gatherCriteria();
            var params = angular.copy(criteria);

            params.api = 'search_user';
            params.token = token;
            params.sort = parseIntNullable($scope.input.sort);
            params.order = parseIntNullable($scope.input.order);
            params.csv = $app.timezone;

            CSV.get(params).then(function () {}, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        $scope.purchaseLog = function (user) {
            $modal.open({
                templateUrl: 'partials/dialog_purchase_point_log.html',
                controller: $app.PurchasePointLogModal,
                windowClass: 'user-detail-modal',
                resolve: {
                    data: function () {
                        return user;
                    }
                }
            });
        };

        /*
         * logical get age Check
         * If gender is male return --
         * if "Gender" is female :
         *  if "verification_flag" is 1 return "vertify"
         *  else return "no vertify"
         */
        $scope.getAgeCheck = function (user) {
            var gender = user.gender;
            var strTranslateWord = 'LAYOUT.NO_DATA';
            if (gender === 1) {
                var verification_flag = user.verification_flag;
                switch (verification_flag) {
                    case -2:
                        strTranslateWord = 'REPORT.APPROVE_DENY_IMAGE.NONE';
                        break;
                    case -1:
                        strTranslateWord = 'REPORT.APPROVE_DENY_IMAGE.DENIED';
                        break;
                    case 0:
                        strTranslateWord = 'REPORT.APPROVE_DENY_IMAGE.PENDING';
                        break;
                    case 1:
                        strTranslateWord = 'USER.USER_LIST.VALUE_VERIFIED';
                        break;
                }
            }
            return strTranslateWord;
        };
    };

    /* create controller userctrl */
    UserCtrl.$inject = ['$scope', '$routeParams', '$location', '$translate', '$modal', 'API', 'CSV', 'Session', 'Dialog'];
    $app.controllers.controller('UserCtrl', UserCtrl);

    $app.PurchasePointLogModal = function ($scope, $q, $injector, $modalInstance, $translate, API, Session, Dialog, data) {
        $injector.invoke($app.BaseModalCtrl, this, {
            $scope: $scope,
            $q: $q,
            API: API
        });
        $scope.user = data;
        $scope.close = function () {
            $modalInstance.close();
        };
        $scope.data = {
            time: LocalTime.formats.yyyyMMdd,
            point: 0,
            price: 0
        };

        API.call({
            api: 'lst_log_purchase',
            token: Session.getAuthority().token,
            id: $scope.user.user_id
        }).then(function (data) {
            $scope.data = data.list;
        }, function (errorCode) {
            Dialog.error(errorCode).then(function () {
                $scope.close();
            });
        });

    };

    $app.PurchasePointLogModal.$inject = ['$scope', '$q', '$injector', '$modalInstance', '$translate', 'API', 'Session', 'Dialog', 'data'];
})();
