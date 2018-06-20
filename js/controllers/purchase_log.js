(function () {
    var PurchaseLogCtrl = function ($scope, $modal, $translate, Session, API, CSV, Dialog) {
        var token = Session.getAuthority().token;
        $scope.setting = {
            itemsPerPage: $app.pageSize,
            numberPagesDisplay: $app.pageDisplay,
            currentPage: 1,
            totalItems: 0
        };

        $scope.attributes = {
            userTypes: $app.labels.get('userTypes', true),
            orderBys: $app.labels.get('orderBys'),
            production_type: $app.labels.get('production_type'),
            add_by_admin: $app.labels.get('add_by_admin'),
            purchaseSuccess: $app.labels.get('purchaseSuccess'),
            purchaseTypes: $app.labels.get('purchaseTypes'),
            paymentMethod: $app.labels.get('paymentMethod'),
            paymentType: $app.labels.get('production_type', true)
        };
        // default display
        $scope.input = {
            userType: $scope.attributes.userTypes[0].value,
            sort: 1,
            order: $scope.attributes.orderBys[0].value,
            purchaseType: $scope.attributes.purchaseTypes[0].value,
            purchaseSuccess: $scope.attributes.purchaseSuccess[0].value,
            paymentMethod: $scope.attributes.paymentMethod[0].value,
            paymentType: $scope.attributes.paymentType[0].value
        };

        $scope.data = new Array();

        $scope.startSearch = function () {
            $scope.setting.totalItems = 0;
            $scope.setting.currentPage = 1;
            $scope.load($scope.setting.currentPage);
        };

        $scope.load = function (page) {
            if ($scope.input.userType === $scope.attributes.userTypes[0].value) {
                $scope.input.account = null;
            }

            API.call({
                api: 'search_log_purchase',
                token: token,
                id: $scope.input.userId,
                from_time: new LocalTime($scope.input.fromDate).toString(),
                to_time: new LocalTime($scope.input.toDate).endOfDay().toString(),
                user_type: parseIntNullable($scope.input.userType) > -1 ? parseIntNullable($scope.input.userType) : null,
                email: $scope.input.account,
                sort: parseIntNullable($scope.input.sort),
                order: parseIntNullable($scope.input.order),
                skip: parseIntNullable($scope.setting.itemsPerPage * (page - 1)),
                take: $scope.setting.itemsPerPage,
                cm_code: $scope.input.cm,
                success: parseIntNullable($scope.input.purchaseSuccess),
                purchase_type: parseIntNullable($scope.input.purchaseType),
                payment_method: parseIntNullable($scope.input.paymentMethod),
                payment_type: parseIntNullable($scope.input.paymentType)
            }).then(function (data) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.setting.totalItems = data.total;
                $scope.data = data.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        $scope.exportCSV = function () {
            var reqDataExportCSV = {
                api: 'search_log_purchase',
                token: token,
                id: $scope.input.userId,
                from_time: new LocalTime($scope.input.fromDate).toString(),
                to_time: new LocalTime($scope.input.toDate).endOfDay().toString(),
                user_type: parseIntNullable($scope.input.userType) > -1 ? parseIntNullable($scope.input.userType) : null,
                email: $scope.input.account,
                sort: parseIntNullable($scope.input.sort),
                order: parseIntNullable($scope.input.order),
                cm_code: $scope.input.cm,
                success: parseIntNullable($scope.input.purchaseSuccess),
                purchase_type: parseIntNullable($scope.input.purchaseType),
                payment_method: parseIntNullable($scope.input.paymentMethod),
                payment_type: parseIntNullable($scope.input.paymentType),
                csv: $app.timezone
            };

            CSV.get(reqDataExportCSV).then(function () {

            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };
    };

    PurchaseLogCtrl.$inject = ['$scope', '$modal', '$translate', 'Session', 'API', 'CSV', 'Dialog'];
    $app.controllers.controller('PurchaseLogCtrl', PurchaseLogCtrl);
})();
