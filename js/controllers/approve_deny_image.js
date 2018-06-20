(function () {
    var ApproveDenyImageCtrl = function ($scope, $translate, $modal, API, Session, Dialog) {
        $scope.approve_deny = {};
        $scope.filter = {};
        var token = Session.getAuthority().token;
        // Setting info paging
        $scope.setting = {
            numberPagesDisplay: $app.pageDisplay,
            itemsPerPage: $app.pageSize,
            currentPage: 1,
            totalItems: 0
        };
        // built an array filter image status, sort
        $scope.attributes = {
            sortBys: [{
                    value: 1,
                    label: $translate('REPORT.APPROVE_DENY_IMAGE.UPLOAD_TIME')
                }, {
                    value: 2,
                    label: $translate('REPORT.APPROVE_DENY_IMAGE.REVIEW_TIME')
                }],
            filters: $app.labels.get('approve_deny_image_filter'),
            gender: $app.labels.get('gender_generality'),
            imageTypes: $app.labels.get('imageTypes', true),
            orderBys: $app.labels.get('orderBys')
        };

        $scope.approve_deny.filterBy = $scope.attributes.filters[0].value;
        $scope.approve_deny.sortBy = $scope.attributes.sortBys[0].value;
        $scope.approve_deny.isPending = true;
        $scope.approve_deny.orderBy = $scope.attributes.orderBys[0].value;
        $scope.approve_deny.img_type = $scope.attributes.imageTypes[0].value;
        $scope.filter.gender = $scope.attributes.gender[0].value;

        // change control sort by status when user change option list by image
        $scope.changeStatusControl = function (flag) {
            switch (flag) {
                case 0:
                    $scope.filter.gender = $scope.attributes.gender[0].value;
                    $scope.approve_deny.sortBy = $scope.attributes.sortBys[0].value;
                    $scope.approve_deny.isPending = true;
                    break;
                case 2:
                    $scope.filter.gender = $scope.attributes.gender[0].value;
                    $scope.approve_deny.isPending = false;
                    break;
                default:
                    $scope.filter.gender = $scope.attributes.gender[2].value;
                    $scope.approve_deny.isPending = false;
                    break;
            }
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
                type: parseIntNullable($scope.approve_deny.filterBy),
                img_type: parseIntNullable($scope.approve_deny.img_type),
                img_id: $scope.approve_deny.img_id,
                id: $scope.approve_deny.id,
                order: parseIntNullable($scope.approve_deny.orderBy),
                sort: parseIntNullable($scope.approve_deny.sortBy),
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage,
                gender: parseIntNullable($scope.filter.gender)
            };

            API.call(reqDataSearchImageApproveDeny).then(function (res) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.setting.totalItems = res.total;

                for (var i in res.list) {
                    res.list[i].$imgSrc = $app.imageUrl + '/api=load_img_admin&token=' + token
                            + '&img_id=' + res.list[i].img_id + '&img_kind=2';
                }

                $scope.listImages = res.list;

                switch ($scope.approve_deny.filterBy) {
                    case 0:
                        $scope.title = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                        // set info button: Deny, Pending
                        $scope.buttonLeft = 'btn btn-danger';
                        $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
                        $scope.flagButtonLeft = -1;

                        $scope.buttonRight = 'btn btn-primary';
                        $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
                        $scope.flagButtonRight = 1;
                        
                        $scope.flagShowButtonCenter = false;
                        break;
                    case 1:
                        $scope.title = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
                        // Button: Deny, Pending
                        $scope.buttonLeft = 'btn btn-danger';
                        $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
                        $scope.flagButtonLeft = -1;

                        $scope.buttonRight = 'btn';
                        $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                        $scope.flagButtonRight = 0;
                        
                        $scope.flagShowButtonCenter = false;
                        break;
                    case - 1:
                        $scope.title = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
                        // Button: Approve, Pending
                        $scope.buttonLeft = 'btn btn-primary';
                        $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
                        $scope.flagButtonLeft = 1;

                        $scope.buttonRight = 'btn';
                        $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                        $scope.flagButtonRight = 0;
                        
                        $scope.flagShowButtonCenter = false;
                        break;
                    case 2:
                        $scope.title = $translate('REPORT.APPROVE_DENY_IMAGE.SELECT_ALL');

                        $scope.buttonLeft = 'btn btn-danger';
                        $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
                        $scope.flagButtonLeft = -1;

                        $scope.buttonCenter = 'btn';
                        $scope.labelButtonCenter = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                        $scope.flagButtonCenter = 0;

                        $scope.buttonRight = 'btn btn-primary';
                        $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');
                        $scope.flagButtonRight = 1;
                        
                        $scope.flagShowButtonCenter = true;
                        break;
                }
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        // default load image approve
        $scope.load(1);

        // status: deny || approve || pending
        $scope.changeStatusImage = function (status, image) {
            var statusName = '';
            switch (status) {
                case 0:
                    statusName = $translate('REPORT.APPROVE_DENY_IMAGE.PENDING');
                    break;
                case 1:
                    statusName = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVED');
                    image.labelSuccess = true;
                    break;
                case - 1:
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

    ApproveDenyImageCtrl.$inject = ['$scope', '$translate', '$modal', 'API', 'Session', 'Dialog'];
    $app.controllers.controller('ApproveDenyImageCtrl', ApproveDenyImageCtrl);
})();