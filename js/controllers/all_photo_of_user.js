(function () {
    var AllPhotoOfUserCtrl = function ($scope, $location, $q, $routeParams, $modal, $translate, API, Dialog, Session) {
        $scope.approve_deny = {};
        $scope.filter = {};
        var token = Session.getAuthority().token;
        var userId = $routeParams.userId;
        var gender = parseIntNullable($routeParams.gender);

//        var userId = "57b424cce4b07a2214487fb1"; // userId test

        var NUMBER_ITEM_ON_PAGE = 100; // Do yeu cau phan trang lay 100item/page
        var TYPE = 2; // Bao gom pending, approved, deny
        var STATUS_PENDING = 0;
        var STATUS_APPROVED = 1;
        var STATUS_DENIED = -1;

        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: NUMBER_ITEM_ON_PAGE,
            currentPage: 1,
            totalItems: 0
        };

        $scope.attributes = {
            filters: $app.labels.get('approve_deny_image_filter'),
            gender: $app.labels.get('gender_generality'),
            imageTypes: $app.labels.get('imageTypes', true)
        };

        // search image
        $scope.searchImageApproveDeny = function () {
            $scope.setting.totalItems = 0;
            $scope.setting.currentPage = 1;
            $scope.load($scope.setting.currentPage);
        };

        $scope.load = function (page) {
            var reqDataSearchImageApproveDeny = {
                api: 'lst_image',
                token: token,
                type: TYPE,
                id: userId, // user id here
                gender: gender,
                order: -1,  // default
                sort: 1,    // default
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage
            };

            API.call(reqDataSearchImageApproveDeny).then(function (res) {
                $scope.setting.totalItems = res.total;

                for (var i in res.list) {
                    res.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
                            + '&img_id=' + res.list[i].img_id + '&img_kind=2';
                }
                $scope.listImages = res.list;
                $scope.buttonLeft = 'btn btn-danger';
                $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
                $scope.flagButtonLeft = -1;

                $scope.buttonCenter = 'btn';
                $scope.labelButtonCenter = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                $scope.flagButtonCenter = 0;

                $scope.buttonRight = 'btn btn-primary';
                $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
                $scope.flagButtonRight = 1;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        // default load image approve
        $scope.load(1);

        $scope.changeStatusImage = function (status, image) {
            var statusName = '';
            switch (status) {
                case STATUS_PENDING:
                    statusName = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                    break;
                case STATUS_APPROVED:
                    statusName = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVED');
                    image.labelSuccess = true;
                    break;
                case STATUS_DENIED:
                    statusName = $translate('REPORT.APPROVE_DENY_IMAGE.DENIED');
                    image.labelImportant = true;
                    break;
            }

            var reqChangeStatusImage = {
                api: 'review_image',
                token: token,
                img_id: image.img_id,
                type: status
            };

            API.call(reqChangeStatusImage).then(function () {
                image.isSuccess = true;
                image.statusLabel = statusName;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };
    };

    AllPhotoOfUserCtrl.$inject = ['$scope', '$location', '$q', '$routeParams', '$modal', '$translate', 'API', 'Dialog', 'Session'];
    $app.controllers.controller('AllPhotoOfUserCtrl', AllPhotoOfUserCtrl);
})();