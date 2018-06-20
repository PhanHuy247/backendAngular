(function () {
    var FIRST_PAGE = 1;
    var INITIALIZE_TOTAL_DATA = 0;

    var ContactsListCtrl = function ($scope, $translate, $modal, API, Session, Dialog) {
        var token = Session.getAuthority().token;
        $scope.properties = {
            pageSize: $app.pageSize,
            currentPage: FIRST_PAGE,
            pageDisplay: $app.pageDisplay,
            total: INITIALIZE_TOTAL_DATA
        };
        $scope.load = function (page) {
            API.call({
                token: token,
                api: 'list_qa_push',
                skip: $scope.properties.pageSize * (page - 1),
                take: $scope.properties.pageSize
            }).then(function (response) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.properties.total = response.total;
                var lengthResponseList = response.list.length;
                for (var i = 0; i < lengthResponseList; i++) {
                    response.list[i].localTime = LocalTime.from(response.list[i].time, true);
                    response.list[i].isEditMode = false;
                    response.list[i].canEdit = response.list[i].localTime.time.getTime() > Date.now().getTime();
                }

                $scope.messages = response.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        $scope.load(FIRST_PAGE);

        $scope.edit = function (item) {
            item.isEditMode = true;
            item.$clone = angular.copy(item);
        };

        $scope.cancel = function (item) {
            var clone = item.$clone;
            delete item.$clone;
            for (var key in clone) {
                item[key] = clone[key];
            }

            item.isEditMode = false;
            item.showError = {};
        };

        $scope.remove = function (item) {
            Dialog.confirm({
                title: $translate('DIALOG.CONFIRM_TITLE'),
                message: $translate('USER.USER_AUTO_MESSAGE.CONFIRM_DELETE_MESSAGE')
            }).then(function (result) {
                if (result) {
                    API.call({
                        api: 'delete_qa_push',
                        token: token,
                        id: item.id
                    }).then(function () {
                        var offset = $scope.messages.length === 1 ? 1 : 0;
                        var page = $scope.properties.currentPage - offset;

                        $scope.properties.currentPage = page < 1 ? 1 : page;
                        $scope.load($scope.properties.currentPage);
                    }, function (errorCode) {
                        Dialog.error(errorCode);
                    });
                }
            });
        };

        $scope.save = function (item) {
            API.call({
                api: 'upd_qa_push',
                token: token,
                id: item.id,
                url: item.url,
                content: item.content.replace(/^\s+|\s+$/g, ""),
                time: item.localTime.toString(LocalTime.formats.yyyyMMddHHmm)
            }).then(function () {
                item.isEditMode = false;
                delete item.$clone;
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('USER.USER_AUTO_MESSAGE.MESS_UPDATE_CONTENT')
                }).then(function () {
                    item.showError = {};
                });
            }, function (errorCode) {
                errorProcess($translate, Dialog, errorCode, item);
            });
        };

        // Detail info: Receivers Notification
        $scope.infoDialog = function (item) {
            $modal.open({
                templateUrl: 'partials/receivers_dialog.html',
                controller: InfoDialogCtrl,
                resolve: {
                    services: function () {
                        return {
                            API: API,
                            Dialog: Dialog,
                            $translate: $translate,
                            Session: Session
                        };
                    },
                    item: function () {
                        return item;
                    }
                }
            });
        };

        $scope.infoDetail = function (item) {
            $modal.open({
                templateUrl: 'partials/notification_detail_dialog.html',
                controller: infoDetailCtrl,
                windowClass: 'user-detail-modal',
                resolve: {
                    services: function () {
                        return {
                            API: API,
                            Dialog: Dialog,
                            $translate: $translate,
                            Session: Session
                        };
                    },
                    item: function () {
                        return item;
                    }
                }
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
                $(data.control + item.id).focus();
            });
        } else {
            Dialog.error(errorCode);
        }
    };

    var InfoDialogCtrl = function ($scope, $modalInstance, services, item) {
        var token = services.Session.getAuthority().token;
        $scope.attributes = {
            userTypes: $app.labels.get('userTypes')
        };

        var nameDialog = services.$translate('DIALOG.ERROR_TITLE');

        $scope.title = services.$translate('USER.USER_AUTO_NOTIFICATION.RECEIVERS_TITLE', {nameDialog: nameDialog});

        $scope.properties = {
            pageSize: $app.pageSize,
            currentPage: FIRST_PAGE,
            pageDisplay: $app.pageDisplay,
            total: INITIALIZE_TOTAL_DATA
        };

        $scope.load = function (page) {
            var reqData = {
                api: 'get_receivers_qa_push',
                token: token,
                id: item.id,
                skip: $scope.properties.pageSize * (page - 1),
                take: $scope.properties.pageSize
            };

            services.API.call(reqData).then(function (res) {
                $scope.properties.total = res.total;
                $scope.receiversList = res.list;
            }, function (errorCode) {
                services.Dialog.error(errorCode);
            });
        };

        $scope.load(FIRST_PAGE);

        $scope.Ok = function () {
            $modalInstance.close();
        };
    };

    var infoDetailCtrl = function ($scope, $filter, $modal, $modalInstance, services, item) {
        var token = services.Session.getAuthority().token;
        var job = [{
                value: 0,
                label: '学生'
            }, {
                value: 1,
                label: 'OL'
            }, {
                value: 2,
                label: 'アルバイター'
            }, {
                value: 3,
                label: 'フリーター'
            }, {
                value: 4,
                label: '看護士'
            }, {
                value: 5,
                label: '保育士'
            }, {
                value: 6,
                label: '販売員'
            }, {
                value: 7,
                label: 'モデル'
            }, {
                value: 8,
                label: '教師'
            }, {
                value: 9,
                label: '家事手伝い'
            }, {
                value: 10,
                label: '主婦'
            }, {
                value: 11,
                label: '飲食系'
            }, {
                value: 12,
                label: 'アパレル系'
            }, {
                value: 13,
                label: '美容系'
            }, {
                value: 14,
                label: 'お水系'
            }, {
                value: 15,
                label: 'ヒミツ'
            }, {
                value: 16,
                label: 'その他'
            }, {
                value: 17,
                label: '会社員'
            }, {
                value: 18,
                label: '経営者'
            }, {
                value: 19,
                label: '経営幹部'
            }, {
                value: 20,
                label: 'フリーター'
            }, {
                value: 21,
                label: '学生'
            }, {
                value: 22,
                label: 'エンジニア'
            }, {
                value: 23,
                label: '製造系'
            }, {
                value: 24,
                label: '運輸系'
            }, {
                value: 25,
                label: '金融系'
            }, {
                value: 26,
                label: '不動産系'
            }, {
                value: 27,
                label: '法律系'
            }, {
                value: 28,
                label: 'IT系'
            }, {
                value: 29,
                label: '医療系'
            }, {
                value: 30,
                label: '教育系'
            }, {
                value: 31,
                label: '福祉系'
            }, {
                value: 32,
                label: 'アパレル系'
            }, {
                value: 33,
                label: 'メディア系'
            }, {
                value: 34,
                label: '芸術系'
            }, {
                value: 35,
                label: 'その他'
            }, {
                value: 36,
                label: 'ヒミツ'
            }];
        var getJob = function ($sex) {
            $sex = parseIntNullable($sex);
            var confJob = {
                1: [0, 16],
                0: [17, 36]
            };
            var min = confJob[0][0];
            var max = confJob[0][1];
            var result = [];
            if ($sex !== 0 && $sex !== 1) {
                min = 0;
                max = 36;
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

        $scope.property = {
            user_type: $app.labels.get('userTypes', true),
            is_purchase: $app.labels.get('isPurchase'),
            gender: $app.labels.get('genders', true),
            deviceType: $app.labels.get('deviceType', true),
            job: getJob(),
            region: $app.labels.get('region'),
            flags: $app.labels.get('userStatuses', true),
            cm_code: new Array,
            cup: $app.labels.get('cup'),
            cute_type: $app.labels.get('cuteType'),
            join_hours: $app.labels.get('joinHours')
        };
        var dateFomat = function (date) {
            var newDate = LocalTime.from(date).time;
            var datere = new Date(newDate);
            return datere;
        };
        var getCmCode = function (cm_code) {
            var cmCodeList = [];
            angular.forEach(cm_code, function (value, key) {
                angular.forEach($scope.property.cm_code, function (obj, item) {
                    if (value == obj.label) {
                        cmCodeList.push(item);
                    }
                });
            });
            return cmCodeList;
        };
        var reqData = {
            api: 'get_qa_push',
            token: token,
            id: item.id
        };
        services.API.call(reqData).then(function (res) {
            $scope.data = res;
            var reqCmCode = {
                api: 'get_all_cm_code',
                token: token
            };
            services.API.call(reqCmCode).then(function (data) {
                angular.forEach(data, function (value, key) {
                    $scope.property.cm_code[key] = {value: key, label: value};
                    $scope.query.cm_code = getCmCode($scope.data.query.cm_code);
                });
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
            $scope.query = {
                is_purchase: angular.isDefined($scope.data.query.is_purchase) ? $scope.data.query.is_purchase : 2,
                from_reg_day: angular.isDefined($scope.data.query.from_reg_day) ? dateFomat($scope.data.query.from_reg_day) : null,
                to_reg_day: angular.isDefined($scope.data.query.to_reg_day) ? dateFomat($scope.data.query.to_reg_day) : null,
                last_from_pur_day: angular.isDefined($scope.data.query.last_from_pur_day) ? dateFomat($scope.data.query.last_from_pur_day) : null,
                last_to_pur_day: angular.isDefined($scope.data.query.last_to_pur_day) ? dateFomat($scope.data.query.last_to_pur_day) : null,
                from_login_day: angular.isDefined($scope.data.query.from_login_day) ? dateFomat($scope.data.query.from_login_day) : null,
                to_login_day: angular.isDefined($scope.data.query.to_login_day) ? dateFomat($scope.data.query.to_login_day) : null,
                lower_bir: angular.isDefined($scope.data.query.lower_bir) ? dateFomat($scope.data.query.lower_bir) : null,
                upper_bir: angular.isDefined($scope.data.query.upper_bir) ? dateFomat($scope.data.query.upper_bir) : null,
                from_pur_day: angular.isDefined($scope.data.query.from_pur_day) ? dateFomat($scope.data.query.from_pur_day) : null,
                to_pur_day: angular.isDefined($scope.data.query.to_pur_day) ? dateFomat($scope.data.query.to_pur_day) : null
            };

        }, function (errorCode) {
            services.Dialog.error(errorCode);
        });

        $scope.Ok = function () {
            $modalInstance.close();
        };

        // Detail info
        $scope.infoDialog = function (item) {
            $modal.open({
                templateUrl: 'partials/receivers_dialog.html',
                controller: InfoDialogCtrl,
                resolve: {
                    services: function () {
                        return {
                            API: services.API,
                            Dialog: services.Dialog,
                            $translate: services.$translate,
                            Session: services.Session
                        };
                    },
                    item: function () {
                        return item;
                    }
                }
            });
        };
    };

    ContactsListCtrl.$inject = ['$scope', '$translate', '$modal', 'API', 'Session', 'Dialog'];
    $app.controllers.controller('ContactsListCtrl', ContactsListCtrl);
})();