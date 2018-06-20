(function () {
    var VideoManagementCtrl = function ($scope, $sce, $translate, $modal, Session, API, Dialog) {
        var token = Session.getAuthority().token;

        var STATUS_PENDDING = 0;
        var STATUS_APPROVE = 1;
        var STATUS_DENY = -1;
        var SELECT_ALL = 2;

        $scope.input = {};

        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: $app.pageSize,
            currentPage: 1,
            totalItems: 0
        };

        $scope.attributes = {
            sortByTime: $app.labels.get('video_secret_filter_by_time'),
            filterByStatus: $app.labels.get('video_secret_filter_by_status'),
            orderBys: $app.labels.get('orderBys')
        };

        $scope.input.filterByStatus = $scope.attributes.filterByStatus[0].value;
        $scope.input.sortByTime = $scope.attributes.sortByTime[0].value;
        $scope.input.orderBy = $scope.attributes.orderBys[0].value;

        $scope.input.isPending = true;

        $scope.changeStatusControl = function (flag) {
            switch (flag) {
                case STATUS_PENDDING:
                    $scope.input.sortByTime = $scope.attributes.sortByTime[0].value;
                    $scope.input.isPending = true;
                    break;
                default:
                    $scope.input.isPending = false;
                    break;
            }
        };

        $scope.searchVideo = function () {
            $scope.setting.totalItems = 0;
            $scope.setting.currentPage = 1;
            $scope.load($scope.setting.currentPage);
        };

        $scope.load = function (page) {
            var reqSearchVideo = {
                api: 'lst_video',
                token: token,
                video_status: parseIntNullable($scope.input.filterByStatus),
                video_id: jQuery("#video-id").val().trim(),
                id: jQuery("#user-id").val().trim(),
                email: jQuery("#email").val().trim(),
                user_name: jQuery("#user-name").val().trim(),
                order: parseIntNullable($scope.input.orderBy),
                sort: parseIntNullable($scope.input.sortByTime),
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage
            };
            console.log('====req====');
            console.log(reqSearchVideo);
            API.call(reqSearchVideo).then(function (res) {
                $scope.setting.totalItems = res.total;
                $scope.videoLists = res.list;
                console.log('====res====');
                console.log(res.list);

                switch ($scope.input.filterByStatus) {
                    case STATUS_PENDDING:     // case pendding
                        $scope.title = $translate('REPORT.VIDEO_MANAGEMENT.PENDING');

                        $scope.buttonLeft = 'btn btn-danger';
                        $scope.labelButtonLeft = $translate('REPORT.VIDEO_MANAGEMENT.DENY');
                        $scope.flagButtonLeft = -1;

                        $scope.buttonRight = 'btn btn-primary';
                        $scope.labelButtonRight = $translate('REPORT.VIDEO_MANAGEMENT.APPROVE');
                        $scope.flagButtonRight = 1;

                        $scope.flagShowButtonCenter = false;
                        break;
                    case STATUS_APPROVE:     // case approve
                        $scope.title = $translate('REPORT.VIDEO_MANAGEMENT.APPROVE');

                        $scope.buttonLeft = 'btn btn-danger';
                        $scope.labelButtonLeft = $translate('REPORT.VIDEO_MANAGEMENT.DENY');
                        $scope.flagButtonLeft = -1;

                        $scope.buttonRight = 'btn';
                        $scope.labelButtonRight = $translate('REPORT.VIDEO_MANAGEMENT.PENDING');
                        $scope.flagButtonRight = 0;

                        $scope.flagShowButtonCenter = false;
                        break;
                    case STATUS_DENY:   // case deny
                        $scope.title = $translate('REPORT.VIDEO_MANAGEMENT.DENY');

                        $scope.buttonLeft = 'btn btn-primary';
                        $scope.labelButtonLeft = $translate('REPORT.VIDEO_MANAGEMENT.APPROVE');
                        $scope.flagButtonLeft = 1;

                        $scope.buttonRight = 'btn';
                        $scope.labelButtonRight = $translate('REPORT.VIDEO_MANAGEMENT.PENDING');
                        $scope.flagButtonRight = 0;

                        $scope.flagShowButtonCenter = false;
                        break;
                    case SELECT_ALL:
                        $scope.title = $translate('REPORT.VIDEO_MANAGEMENT.SELECT_ALL');

                        $scope.buttonLeft = 'btn btn-danger';
                        $scope.labelButtonLeft = $translate('REPORT.VIDEO_MANAGEMENT.DENY');
                        $scope.flagButtonLeft = -1;

                        $scope.buttonCenter = 'btn';
                        $scope.labelButtonCenter = $translate('REPORT.VIDEO_MANAGEMENT.PENDING');
                        $scope.flagButtonCenter = 0;

                        $scope.buttonRight = 'btn btn-primary';
                        $scope.labelButtonRight = $translate('REPORT.VIDEO_MANAGEMENT.APPROVE');
                        $scope.flagButtonRight = 1;

                        $scope.flagShowButtonCenter = true;
                        break;
                }
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        // Default load first page when go to page first
        $scope.load(1);

        $scope.changeStatusVideo = function (status, video) {
            var statusName = '';
            switch (status) {
                case STATUS_PENDDING:
                    statusName = $translate('REPORT.VIDEO_MANAGEMENT.PENDING');
                    break;
                case STATUS_APPROVE:
                    statusName = $translate('REPORT.VIDEO_MANAGEMENT.APPROVED');
                    video.labelSuccess = true;
                    break;
                case STATUS_DENY:
                    statusName = $translate('REPORT.VIDEO_MANAGEMENT.DENIED');
                    video.labelImportant = true;
                    break;
            }

            var reqChangeStatusVideo = {
                api: 'review_video',
                token: token,
                video_id: video.video_id,
                video_status: status
            };

            API.call(reqChangeStatusVideo).then(function () {
                video.isSuccess = true;
                video.statusLabel = statusName;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };
    };

    VideoManagementCtrl.$inject = ['$scope', '$sce', '$translate', '$modal', 'Session', 'API', 'Dialog'];
    $app.controllers.controller('VideoManagementCtrl', VideoManagementCtrl);
})();