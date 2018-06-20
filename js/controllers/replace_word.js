(function() {
    var ReplaceWordCtrl = function($scope, $translate, Session, API, Dialog) {
        var token = Session.getAuthority().token;
        $scope.input = {};
        $scope.numberPagesDisplay = $app.pageDisplay;
        $scope.itemsPerPage = $app.pageSize;
        $scope.currentPage = 1;
        $scope.flag = false;

        $scope.attributes = {
            status : [ {
                value : 1,
                label : $translate('FORM.ENABLE')
            }, {
                value : 0,
                label : $translate('FORM.DISABLE')
            } ]
        };

        $scope.input.status = $scope.attributes.status[0].value;

        // request data render list
        var reqDataRenderList = {
            api : 'list_replace_word',
            token : token,
            skip : ($scope.currentPage - 1) * $scope.itemsPerPage,
            take : $scope.itemsPerPage,
            search_word: parseIntNullable($scope.input.search_word)
        };

        API.call(reqDataRenderList).then(function(data) {
            $scope.replaceWordList = data.list;
            $scope.totalItems = data.total;
        }, function(errorCode) {
            Dialog.error(errorCode);
        });

        // paging
        $scope.pageSelect = function(pageNo) {
            var reqDataRenderList = {
                api : 'list_replace_word',
                token : token,
                skip : (pageNo - 1) * $scope.itemsPerPage,
                take : $scope.itemsPerPage,
                search_word: parseIntNullable($scope.input.search_word)
            };

            API.call(reqDataRenderList).then(function(data) {
                $("html, body").animate({
                    scrollTop: $("#block-center-screen").position().top
                }, 1000);
                $scope.totalItems = data.total;
                $scope.replaceWordList = data.list;
            }, function(errorCode) {
                Dialog.error(errorCode);
            });
        };
        
        $scope.searchReplaceWord = function () {
            var reqDataRenderList = {
                api: 'list_replace_word',
                token: token,
                skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
                take: $scope.itemsPerPage,
                search_word: $scope.input.search_word
            };

            API.call(reqDataRenderList).then(function (data) {
                $scope.totalItems = data.total;
                $scope.replaceWordList = data.list;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        // Create replace word
        $scope.createReplaceWord = function() {
            if ($scope.flag) return;
            $scope.flag = true;
            var reqDataCreate = {
                api : 'ins_replace_word',
                token : token,
                word : $scope.input.replace_word,
                flag : parseInt($scope.input.status)
            };

            API.call(reqDataCreate).then(function(newReplaceWord) {
                // request data render list
                var reqDataRenderList = {
                    api : 'list_replace_word',
                    token : token,
                    skip : ($scope.currentPage - 1) * $scope.itemsPerPage,
                    take : $scope.itemsPerPage
                };

                API.call(reqDataRenderList).then(function(data) {
                    $scope.replaceWordList = data.list;
                    $scope.totalItems = data.total;
                }, function(errorCode) {
                    Dialog.error(errorCode);
                });
                $scope.input = {
                    status : $scope.attributes.status[0].value
                };
                $scope.flag = false;
            }, function(errorCode) {
                $scope.flag = false;
                errorHandle($translate, Dialog, errorCode);
            }); // end fn create
        };

        // Edit
        $scope.replaceWordEdit = function(item) {
            item.isEdit = true;
            item.$clone = angular.copy(item);
        };

        // update
        $scope.replaceWordSave = function(item) {
            var reqDataUpd = {
                api : 'upd_replace_word',
                token : token,
                id : item.id,
                word : item.word,
                flag : parseInt(item.flag)
            };

            // call API update
            API.call(reqDataUpd).then(function() {
                item.isEdit = false;
                Dialog.alert({
                    title : $translate('DIALOG.INFO_TITLE'),
                    message : $translate('REPORT.REPLACE_WORD.UPDATE_SUCCESS')
                });
            }, function(errorCode) {
                errorHandle($translate, Dialog, errorCode, item);
            });
        };

        // Delete
        $scope.replaceWordDelete = function(item, index) {
            Dialog.confirm({
                title : $translate('DIALOG.CONFIRM_TITLE'),
                message : $translate('REPORT.REPLACE_WORD.CONFIRM_DELETE')
            }).then(function(result) {
                if (result) {
                    if ($scope.flag) return;
                    $scope.flag = true;
                    // Detele replace word
                    API.call({
                        api : 'del_replace_word',
                        token : token,
                        id : item.id
                    }).then(function() {
                        Dialog.alert({
                            title : $translate('DIALOG.INFO_TITLE'),
                            message : $translate('REPORT.REPLACE_WORD.DELETE_SUCCESS')
                        }).then(function() {
                            var offset = $scope.replaceWordList.length === 1 ? 1 : 0;
                            var page = $scope.currentPage - offset;

                            $scope.currentPage = page < 1 ? 1 : page;

                            $scope.pageSelect($scope.currentPage);
                        });
                        $scope.flag = false;
                    }, function(errorCode) {
                        $scope.flag = false;
                        Dialog.error(errorCode);
                    });
                }
            });
        };

        // Cancel
        $scope.replaceWordCancel = function(item) {
            var clone = item.$clone;
            delete item.$clone;
            for ( var key in clone) {
                item[key] = clone[key];
            }

            item.isEdit = false;
        };
    };
    var messageDataHandle = {
        75 : {
            control: '#replaceWord',
            message: 'REPORT.REPLACE_WORD.ADD_ERROR'
        }
    };

    var errorHandle = function(translate, Dialog, errorCode, item) {
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

    ReplaceWordCtrl.$inject = [ '$scope', '$translate', 'Session', 'API', 'Dialog' ];
    $app.controllers.controller('ReplaceWordCtrl', ReplaceWordCtrl);
})();
