(function () {
    var AllVideosOfUserCtrl = function ($scope, $location, $q, $routeParams, $modal, $translate, API, Dialog, Session) {
        var token = Session.getAuthority().token;
        var userId = $routeParams.userId;
        
        var STATUS_PENDDING = 0;
        var STATUS_APPROVE = 1;
        var STATUS_DENY = -1;
        var SELECT_ALL = 2;

        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: $app.pageSize,
            currentPage: 1,
            totalItems: 0
        };

        $scope.attributes = {
            filterByStatus: $app.labels.get('video_secret_filter_by_status')
        };

        $scope.load = function (page) {
            var reqSearchVideoSecret = {
                api: 'lst_video',
                token: token,
                video_status: SELECT_ALL,
                id: userId,
                order: -1,  // default
                sort: 1,    // default
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage
            };
            console.log(reqSearchVideoSecret);

            API.call(reqSearchVideoSecret).then(function (res) {
                $scope.setting.totalItems = res.total;
                $scope.videoLists = res.list;

                $scope.buttonLeft = 'btn btn-danger';
                $scope.labelButtonLeft = $translate('REPORT.VIDEO_MANAGEMENT.DENY');
                $scope.flagButtonLeft = STATUS_DENY;

                $scope.buttonCenter = 'btn';
                $scope.labelButtonCenter = $translate('REPORT.VIDEO_MANAGEMENT.PENDING');
                $scope.flagButtonCenter = STATUS_PENDDING;

                $scope.buttonRight = 'btn btn-primary';
                $scope.labelButtonRight = $translate('REPORT.VIDEO_MANAGEMENT.APPROVE');
                $scope.flagButtonRight = STATUS_APPROVE;
            }, function (errorCode) {
                Dialog.error(errorCode);
                console.log(errorCode);
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

    AllVideosOfUserCtrl.$inject = ['$scope', '$location', '$q', '$routeParams', '$modal', '$translate', 'API', 'Dialog', 'Session'];
    $app.controllers.controller('AllVideosOfUserCtrl', AllVideosOfUserCtrl);
})();