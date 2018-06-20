(function () { 
    var BuzzLogCtrl = function ($scope, $location, $translate, $modal, Session, API, Dialog, CSV) {
        // string token
        var userId = $location.search().user_id;
        $scope.token = Session.getAuthority().token;
        $scope.imageUrl = $app.imageUrl;
        // Setting info paging
        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: $app.pageSize,
            currentPage: 1,
            totalItems: 0,
            imageSize: {
                width: $app.size.image.width,
                height: $app.size.image.height
            },
            giftSize: {
                width: $app.size.gift.width,
                height: $app.size.gift.height
            }
        };

        $scope.attributes = {
            userTypes: $app.labels.get('userTypes', true),
            buzz_status: $app.labels.get('buzz_status'),
            buzzTypes: [{
                    value: '',
                    label: $translate('FORM.PLEASE_SELECT')
                }, {
                    value: 0,
                    label: $translate('LOG.BUZZ.TYPE.OPT_STATUS')
                }, {
                    value: 1,
                    label: $translate('LOG.BUZZ.TYPE.OPT_IMAGE')
                }, {
                    value: 2,
                    label: $translate('LOG.BUZZ.TYPE.OPT_GIFT')
                }]
        };

        $scope.buzz = {
            userType : $scope.attributes.userTypes[0].value,
            type : $scope.attributes.buzzTypes[0].value,
            buzz_status : $scope.attributes.buzz_status[0].value,
        };

        // Search log buzz
        $scope.searchLogBuzz = function () {
            $scope.setting.totalItems = 0;
            $scope.setting.currentPage = 1;
            $scope.load($scope.setting.currentPage);
        };

        $scope.load = function (page) {
            if ($scope.buzz.userType === $scope.attributes.userTypes[0].value) {
                $scope.buzz.account = null;
            }

            var reqDataSearchLogBuzz = {
                api: 'search_log_buzz',
                token: $scope.token,
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage,
                id: $scope.buzz.userId,
                user_type: parseIntNullable($scope.buzz.userType),
                email: $scope.buzz.account,
                from_time: new LocalTime($scope.buzz.fromTime).toString(),
                to_time: new LocalTime($scope.buzz.toTime).endOfDay().toString(),
                buzz_type: parseIntNullable($scope.buzz.type),
                buzz_status: parseIntNullable($scope.buzz.buzz_status)
            };

            API.call(reqDataSearchLogBuzz).then(function (res) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                for (var i = 0; i < res.list.length; i++) {
                    if (res.list[i].buzz_type === 1) {
                        res.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + $scope.token + '&img_id=' + res.list[i].buzz_val + '&img_kind=2';
                    }
                }
                ;

                $scope.setting.totalItems = res.total;
                $scope.buzzList = res.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        if (userId !== undefined) {
            $scope.buzz.userId = userId;
            $scope.searchLogBuzz();
        }
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

        $scope.buzzDetail = function (buzzId) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/buzz_detail.html',
                controller: $app.BuzzDetailCtrl,
                windowClass: 'user-detail-modal',
                resolve: {
                    buzzId: function () {
                        return buzzId;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data === "del") {
                    var offset = $scope.buzzList.length === 1 ? 1 : 0;
                    var page = $scope.setting.currentPage - offset;

                    $scope.setting.currentPage = page < 1 ? 1 : page;

                    $scope.load($scope.setting.currentPage);
                }
            });
        };
        // comment list
        $scope.showCommentList = function (buzzId) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/buzz_comment_list.html',
                controller: $app.BuzzDetailCtrl,
                windowClass: 'user-detail-modal',
                resolve: {
                    buzzId: function () {
                        return buzzId;
                    }
                }
            });
        };

        // liked list
        $scope.showLikedList = function (buzzId, buzzNum) {
            if (buzzNum === 0)
                return;

            $modal.open({
                templateUrl: 'partials/buzz_liked_list.html',
                controller: LikedListCtrl,
                resolve: {
                    services: function () {
                        return {
                            API: API,
                            Dialog: Dialog,
                            $translate: $translate,
                            Session: Session
                        };
                    },
                    buzzId: function () {
                        return buzzId;
                    }
                }
            });
        };

        // Export
        $scope.exportCSV = function () {
            if ($scope.buzz.userType === $scope.attributes.userTypes[0].value) {
                $scope.buzz.account = null;
            }

            var reqDataExportCSV = {
                api: 'search_log_buzz',
                token: $scope.token,
                id: $scope.buzz.userId,
                user_type: parseIntNullable($scope.buzz.userType),
                email: $scope.buzz.account,
                from_time: new LocalTime($scope.buzz.fromTime).toString(),
                to_time: new LocalTime($scope.buzz.toTime).endOfDay().toString(),
                buzz_type: parseIntNullable($scope.buzz.type),
                csv: $app.timezone
            };

            CSV.get(reqDataExportCSV).then(function () {

            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };
    };

    BuzzLogCtrl.$inject = ['$scope', '$location', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
    $app.controllers.controller('BuzzLogCtrl', BuzzLogCtrl);
})();
