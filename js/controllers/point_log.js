(function () {
    var PointLogCtrl = function ($scope, $translate, $sce, $modal, Session, API, CSV, Dialog) {
        var token = Session.getAuthority().token;
        $scope.enableProvider = false;//Default : hidden PROVIDER select box.
        $scope.enableFreePoint_41 = false;
        $scope.enableFreePoint_42 = false;
        $scope.properties = {
            total: 0,
            currentPage: 1,
            itemsPerPage: $app.pageSize,
            numberPagesDisplay: $app.pageDisplay,
            userTypes: $app.labels.get('userTypes', true),
            sort: [{
                    value: 1,
                    label: $translate('LOG.POINT.ACTION_TIME')
                }],
            saleTypes: $app.labels.get('saleType'),
            orderBys: $app.labels.get('orderBys'),
            types: $app.labels.get('logReasons', true)
        };
        $scope.input = {
            sort: $scope.properties.sort[0].value,
            userType: $scope.properties.userTypes[0].value,
            type: $scope.properties.types[0].value,
            order: -1
        };

        //Call api to get options of FREE POINT select
        API.call({
            api: 'lst_free_point',
            token: token,
            skip: 0,
            take: 0
        }).then(function (response) {
            $scope.properties.freePoints = response.list;
        }, function (code) {
            Dialog.error(code);
        });

        $scope.beginSearch = function () {
            $scope.properties.total = 0;
            $scope.properties.currentPage = 1;
            $scope.load($scope.properties.currentPage);
        };

        $scope.load = function (page) {
            API.call({
                api: 'search_log_pnt',
                token: token,
                id: $scope.input.id,
                user_type: $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.userType : null,
                email: $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.account : null,
                cm_code: $scope.input.cmCode,
                from_time: new LocalTime($scope.input.fromTime).toString(),
                to_time: new LocalTime($scope.input.toTime).endOfDay().toString(),
                from_point: parseIntNullable($scope.input.from_point),
                to_point: parseIntNullable($scope.input.to_point),
                type: $scope.input.type !== $scope.properties.types[0].value ? $scope.input.type : null,
                free_point_id: $scope.input.free_point !== $scope.properties.types[0].free_point ? $scope.input.free_point : null,
                sale_type: $scope.input.sale_type !== $scope.properties.types[0].sale_type ? $scope.input.sale_type : null,
                sort: $scope.input.sort,
                order: parseIntNullable($scope.input.order),
                skip: $scope.properties.itemsPerPage * (page - 1),
                take: $scope.properties.itemsPerPage
            }).then(function (response) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.properties.total = response.total;
                for (var i in response.list) {
                    response.list[i].isSetPartnerId = false;
                    if (response.list[i].type === 41) {
                        //if is add point free
                        var logReasons = $scope.properties.freePoints;
                        for (var j in logReasons) {
                            if (logReasons[j].free_point_number === response.list[i].free_point_type) {
                                response.list[i].isSetPartnerId = true;
                                response.list[i].type = $sce.trustAsHtml($translate('LOG.POINT.SELECT.ADD_FREE_POINT_FROM_XXX', {name: logReasons[j].free_point_name}));
                            }
                        }
                    } else if (response.list[i].type === 42) {
                        //if is add point free
                        var saleTypes = $scope.properties.saleTypes;
                        for (var j in saleTypes) {
                            if (saleTypes[j].value === response.list[i].sale_type) {
                                response.list[i].isSetPartnerId = true;
                                response.list[i].type = $sce.trustAsHtml($translate('LOG.POINT.SELECT.ADD_POINT_BY_XXX', {name: saleTypes[j].label}));
                            }
                        }
                    } else {
                        var partnerID = response.list[i].partner_id;
                        var partnerName = response.list[i].partner_name;
                        var html = '<a class="btn-link" href="#/user/user_detail/' + partnerID + '" target="_blank">' + partnerName + '</a>';
                        
                        if (angular.isUndefined(partnerName)) {
                            if (angular.isUndefined(partnerID)) {
                                partnerID = "";
                            }
                            html = '<a class="btn-link">' + partnerID + '</a>';
                        }
                        
                        var logReasons = $app.labels.get('logReasons');
                        for (var j in logReasons) {
                            if (logReasons[j].value === response.list[i].type && !isUnset(logReasons[j].name)) {
                                response.list[i].isSetPartnerId = true;
                                response.list[i].type = $sce.trustAsHtml($translate(logReasons[j].name, {name: html}));
                            }
                        }
                    }
                }
                $scope.log = response.list;
            }, function (code) {
                Dialog.error(code);
            });
        };

        $scope.exportCSV = function () {
            var reqDataExportCSV = {
                api: 'search_log_pnt',
                token: token,
                id: $scope.input.id,
                user_type: $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.userType : null,
                email: $scope.input.userType !== $scope.properties.userTypes[0].value ? $scope.input.account : null,
                free_point_id: $scope.input.free_point !== $scope.properties.types[0].free_point ? $scope.input.free_point : null,
                sale_type: $scope.input.sale_type !== $scope.properties.types[0].sale_type ? $scope.input.sale_type : null,
                cm_code: $scope.input.cmCode,
                from_time: new LocalTime($scope.input.fromTime).toString(),
                to_time: new LocalTime($scope.input.toTime).endOfDay().toString(),
                from_point: parseIntNullable($scope.input.from_point),
                to_point: parseIntNullable($scope.input.to_point),
                type: $scope.input.type !== $scope.properties.types[0].value ? $scope.input.type : null,
                sort: $scope.input.sort,
                order: parseIntNullable($scope.input.order),
                csv: $app.timezone
            };

            CSV.get(reqDataExportCSV).then(function () {
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        /*$scope.userDetail = function(userId) {
         $modal.open({
         templateUrl: 'partials/common/dialog_user_detail.html',
         controller: $app.UserDetailCtrl,
         windowClass: 'user-detail-modal',
         resolve: {
         userId: function() {
         return userId;
         }
         }
         });
         };*/


        /*
         * changePurpose
         * @param : purpose_id
         * if purpose_id is provider then show provider select box
         */
        $scope.changeFreePoint = function (type) {
            var configChangeType = [{
                    type: 42,
                    display_flag: "enableFreePoint_42",
                    input_name: "sale_type"
                }, {
                    type: 41,
                    display_flag: "enableFreePoint_41",
                    input_name: "free_point"
                }];

            for (var i in configChangeType) {
                if (configChangeType[i]["type"] === type) {
                    $scope[configChangeType[i]["display_flag"]] = true;
                } else {
                    $scope[configChangeType[i]["display_flag"]] = false;
                    $scope.input[configChangeType[i]["input_name"]] = null;
                }
            }
//      $scope["enableFreePoint_" + type] = true;
//      if (type === 41) {
//        $scope["enableFreePoint_" + type] = true;
//      }else if(type === 42) {
//        $scope.enableFreePoint = true;
//      }else {
//        $scope.enableFreePoint = false;
//        $scope.input.free_point = null;
//      }
        };

        /**/
    };

    PointLogCtrl.$inject = ['$scope', '$translate', '$sce', '$modal', 'Session', 'API', 'CSV', 'Dialog'];
    $app.controllers.controller('PointLogCtrl', PointLogCtrl);
})();
