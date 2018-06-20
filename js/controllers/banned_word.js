(function () {
    var BannedWordCtrl = function ($scope, $translate, Session, API, Dialog) {
        var token = Session.getAuthority().token;
        $scope.input = {};
        $scope.numberPagesDisplay = $app.pageDisplay;
        $scope.itemsPerPage = $app.pageSize;
        $scope.currentPage = 1;
        $scope.flag = false;

        $scope.attributes = {
            status: [{
                value: 1,
                label: $translate('FORM.ENABLE')
            }, {
                value: 0,
                label: $translate('FORM.DISABLE')
            }]
        };

        $scope.input.status = $scope.attributes.status[0].value;

        // request data render list
        var reqDataRenderList = {
            api: 'lst_banned_word',
            token: token,
            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
            take: $scope.itemsPerPage,
            search_word: parseIntNullable($scope.input.search_word)
        };

        API.call(reqDataRenderList).then(function (data) {
            $scope.bannedWordList = data.list;
            $scope.totalItems = data.total;
        }, function (errorCode) {
            Dialog.error(errorCode);
        });

        // paging
        $scope.pageSelect = function (pageNo) {
            var reqDataRenderList = {
                api: 'lst_banned_word',
                token: token,
                skip: (pageNo - 1) * $scope.itemsPerPage,
                take: $scope.itemsPerPage,
                search_word: parseIntNullable($scope.input.search_word)
            };

            API.call(reqDataRenderList).then(function (data) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.totalItems = data.total;
                $scope.bannedWordList = data.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        $scope.searchBannedWord = function () {
            var reqDataRenderList = {
                api: 'lst_banned_word',
                token: token,
                skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
                take: $scope.itemsPerPage,
                search_word: $scope.input.search_word
            };

            API.call(reqDataRenderList).then(function (data) {
                $scope.totalItems = data.total;
                $scope.bannedWordList = data.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        // Create banned word
        $scope.createBannedWord = function () {
            if ($scope.flag)
                return;
            $scope.flag = true;
            var reqDataCreate = {
                api: 'ins_banned_word',
                token: token,
                word: $scope.input.banned_word,
                flag: parseInt($scope.input.status)
            };

            API.call(reqDataCreate).then(function (newBannedWord) {
                // request data render list
                var reqDataRenderList = {
                    api: 'lst_banned_word',
                    token: token,
                    skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
                    take: $scope.itemsPerPage
                };

                API.call(reqDataRenderList).then(function (data) {
                    $scope.bannedWordList = data.list;
                    $scope.totalItems = data.total;
                }, function (errorCode) {
                    Dialog.error(errorCode);
                });
                $scope.input = {
                    status: $scope.attributes.status[0].value
                };
                $scope.flag = false;
                /* $scope.totalItems++;
                 if (parseInt($scope.bannedWordList.length) < parseInt($scope.itemsPerPage)) {
                 var newBannedWordFormat = {
                 id : newBannedWord.id,
                 word : $scope.input.banned_word,
                 flag : parseInt($scope.input.status)
                 };
                 
                 $scope.bannedWordList.push(newBannedWordFormat);
                 }
                 
                 $scope.input = {
                 status : $scope.attributes.status[0].value
                 };
                 $scope.flag = false;*/
            }, function (errorCode) {
                $scope.flag = false;
                errorHandle($translate, Dialog, errorCode);
            }); // end fn create
        };

        // Edit
        $scope.bannedWordEdit = function (item) {
            item.isEdit = true;
            item.$clone = angular.copy(item);
        };

        // update
        $scope.bannedWordSave = function (item) {
            var reqDataUpd = {
                api: 'upd_banned_word',
                token: token,
                id: item.id,
                word: item.word,
                flag: parseInt(item.flag)
            };

            // call API update
            API.call(reqDataUpd).then(function () {
                item.isEdit = false;
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('REPORT.BANNED_WORD.UPDATE_SUCCESS')
                });
            }, function (errorCode) {
                errorHandle($translate, Dialog, errorCode, item);
            });
        };

        // Delete
        $scope.bannedWordDelete = function (item, index) {
            Dialog.confirm({
                title: $translate('DIALOG.CONFIRM_TITLE'),
                message: $translate('REPORT.BANNED_WORD.CONFIRM_DELETE')
            }).then(function (result) {
                if (result) {
                    if ($scope.flag)
                        return;
                    $scope.flag = true;
                    // Detele banned word
                    API.call({
                        api: 'del_banned_word',
                        token: token,
                        id: item.id
                    }).then(function () {
                        Dialog.alert({
                            title: $translate('DIALOG.INFO_TITLE'),
                            message: $translate('REPORT.BANNED_WORD.DELETE_SUCCESS')
                        }).then(function () {
                            var offset = $scope.bannedWordList.length === 1 ? 1 : 0;
                            var page = $scope.currentPage - offset;

                            $scope.currentPage = page < 1 ? 1 : page;

                            $scope.pageSelect($scope.currentPage);
                        });
                        $scope.flag = false;
                    }, function (errorCode) {
                        $scope.flag = false;
                        Dialog.error(errorCode);
                    });
                }
            });
        };

        // Cancel
        $scope.bannedWordCancel = function (item) {
            var clone = item.$clone;
            delete item.$clone;
            for (var key in clone) {
                item[key] = clone[key];
            }

            item.isEdit = false;
        };
    };
    var messageDataHandle = {
        75: {
            control: '#bannedWord',
            message: 'REPORT.BANNED_WORD.ADD_ERROR'
        }
    };

    var errorHandle = function (translate, Dialog, errorCode, item) {
        if (isSet(messageDataHandle[errorCode])) {
            var data = messageDataHandle[errorCode];
            var message = translate(data.message);
            var control = data.control;

            Dialog.alert({
                title: translate('DIALOG.WARNING_TITLE'),
                message: translate(message)
            }).then(function () {
                if (isSet(item) && isSet(item.id)) {
                    control += '-' + item.id;
                }

                $(control).focus();
            });
        } else {
            Dialog.error(errorCode);
        }
    };

    BannedWordCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
    $app.controllers.controller('BannedWordCtrl', BannedWordCtrl);
})();