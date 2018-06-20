(function () {
    var ActionPackageCtrl = function ($scope, $translate, Session, API, Dialog) {
        var token = Session.getAuthority().token;
        var TYPE_APPLE = 0;
        var TYPE_GOOGLE = 1;
        var TYPE_AMAZON = 2;
        var configTypeTab = {
            0: "apple",
            1: "google",
            2: "amazon"
        };
        var configAppTab = {};

        $scope.flag = false;
        $scope.defineTab = $app.labels.get('listApplicationID');
        $scope.setting = {
            itemsPerPage: $app.pageSize,
            numberPagesDisplay: $app.pageDisplay,
            currentPage: 1
        };
        $scope.packages_apple = {};
        $scope.packages_google = {};
        $scope.packages_amazon = {};
        $scope.package_apple = {};
        $scope.package_google = {};
        $scope.package_amazon = {};
        $scope.setting_apple = {};
        $scope.setting_google = {};
        $scope.setting_amazon = {};

        angular.forEach($scope.defineTab, function (value, key) {
            $scope.setting_apple[value["name"]] = {totalItems: 0};
            $scope.setting_google[value["name"]] = {totalItems: 0};
            $scope.setting_amazon[value["name"]] = {totalItems: 0};
            configAppTab[value["value"]] = value["name"];
        });

        $scope.pageSelect = function (page, type, application) {
            API.call({
                api: 'lst_action_point_package',
                type: type, // 0-Apple, 1-Google, 2- Amazon tab
                application: application,
                token: token,
                skip: (page - 1) * $scope.setting.itemsPerPage,
                take: $scope.setting.itemsPerPage
            }).then(function (res) {
                $scope['setting_' + configTypeTab[type]][configAppTab[application]].totalItems = res.length;
                $scope['packages_' + configTypeTab[type]][configAppTab[application]] = res;
            }, function (errorCode) {
                Dialog.error(errorCode);
            });
        };

        angular.forEach($scope.defineTab, function (value, key) {
            $scope.pageSelect($scope.setting.currentPage, TYPE_APPLE, value["value"]);
            $scope.pageSelect($scope.setting.currentPage, TYPE_GOOGLE, value["value"]);
            $scope.pageSelect($scope.setting.currentPage, TYPE_AMAZON, value["value"]);
        });

        $scope.add = function (type, application) {
            if ($scope.flag)
                return;
            $scope.flag = true;
            var codeApplication = "";

            angular.forEach($scope.defineTab, function (element) {
                if (element.value === application) {
                    codeApplication = element.name;
                }
            });

            API.call({
                api: 'irs_action_point_package',
                type: type,
                application: application,
                token: token,
                production_id: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-production-id").val().trim(),
                price: $scope['package_' + configTypeTab[type]].price,
                first_purchase_point: $scope['package_' + configTypeTab[type]].first_purchase_point,
                first_purchase_description: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-first-purchase-description").val().trim(),
                point: $scope['package_' + configTypeTab[type]].point,
                use_chat: $scope['package_' + configTypeTab[type]].use_chat ? true : false,
                use_video_call: $scope['package_' + configTypeTab[type]].use_video_call ? true : false,
                use_voice_call: $scope['package_' + configTypeTab[type]].use_voice_call ? true : false,
                use_gift: $scope['package_' + configTypeTab[type]].use_gift ? true : false,
                use_comment: $scope['package_' + configTypeTab[type]].use_comment ? true : false,
                use_sub_comment: $scope['package_' + configTypeTab[type]].use_sub_comment ? true : false,
                use_unlock_backstage: $scope['package_' + configTypeTab[type]].use_unlock_backstage ? true : false,
                use_save_image: $scope['package_' + configTypeTab[type]].use_save_image ? true : false,
                use_other: $scope['package_' + configTypeTab[type]].use_other ? true : false,
                chat_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-chat-text").val().trim(),
                video_call_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-video-call-text").val().trim(),
                voice_call_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-voice-call-text").val().trim(),
                gift_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-gift-text").val().trim(),
                comment_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-comment-text").val().trim(),
                sub_comment_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-sub-comment-text").val().trim(),
                unlock_backstage_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-unlock-backstage-text").val().trim(),
                save_image_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-save-image-text").val().trim(),
                other_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-other-text").val().trim()
            }).then(function (res) {
                var newItem = {
                    id: res.id,
                    production_id: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-production-id").val().trim(),
                    price: $scope['package_' + configTypeTab[type]].price,
                    first_purchase_point: $scope['package_' + configTypeTab[type]].first_purchase_point,
                    first_purchase_description: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-first-purchase-description").val().trim(),
                    point: $scope['package_' + configTypeTab[type]].point,
                    use_chat: $scope['package_' + configTypeTab[type]].use_chat,
                    use_video_call: $scope['package_' + configTypeTab[type]].use_video_call,
                    use_voice_call: $scope['package_' + configTypeTab[type]].use_voice_call,
                    use_gift: $scope['package_' + configTypeTab[type]].use_gift,
                    use_comment: $scope['package_' + configTypeTab[type]].use_comment,
                    use_sub_comment: $scope['package_' + configTypeTab[type]].use_sub_comment,
                    use_unlock_backstage: $scope['package_' + configTypeTab[type]].use_unlock_backstage,
                    use_save_image: $scope['package_' + configTypeTab[type]].use_save_image,
                    use_other: $scope['package_' + configTypeTab[type]].use_other,
                    chat_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-chat-text").val().trim(),
                    video_call_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-video-call-text").val().trim(),
                    voice_call_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-voice-call-text").val().trim(),
                    gift_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-gift-text").val().trim(),
                    comment_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-comment-text").val().trim(),
                    sub_comment_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-sub-comment-text").val().trim(),
                    unlock_backstage_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-unlock-backstage-text").val().trim(),
                    save_image_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-save-image-text").val().trim(),
                    other_text: jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-other-text").val().trim()
                };
                $scope['packages_' + configTypeTab[type]][configAppTab[application]].push(newItem);
                $scope['package_' + configTypeTab[type]] = {};
                $scope.flag = false;
                // Reset input
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-production-id").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-first-purchase-description").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-other-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-save-image-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-unlock-backstage-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-sub-comment-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-comment-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-gift-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-voice-call-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-video-call-text").val("");
                jQuery("#" + codeApplication + "-" + configTypeTab[type] + "-chat-text").val("");
            }, function (errorCode) {
                $scope.flag = false;
                errorProcess($translate, Dialog, errorCode);
            });
        };

        $scope.delete = function (item, index, type, application) {
            Dialog.confirm({
                title: $translate('DIALOG.CONFIRM_TITLE'),
                message: $translate('SETTINGS.FREE_PAGE.CONFIRM_DELETE')
            }).then(function (result) {
                if (result) {
                    if ($scope.flag)
                        return;
                    $scope.flag = true;
                    API.call({
                        api: 'del_action_point_package',
                        token: token,
                        id: item.id
                    }).then(function () {
                        $scope.flag = false;
                        Dialog.alert({
                            title: $translate('DIALOG.INFO_TITLE'),
                            message: $translate('SETTINGS.FREE_PAGE.MESSAGE_DEL_SUCCESS')
                        }).then(function () {
                            var offset = $scope['packages_' + configTypeTab[0]][configAppTab[1]].length === 1 ? 1 : 0;
                            var package = $scope.setting.currentPage - offset;
                            $scope.setting.currentPage = package < 1 ? 1 : package;
                            $scope.pageSelect($scope.setting.currentPage, type, application);
                        });
                    }, function (errorCode) {
                        $scope.flag = false;
                        Dialog.error(errorCode);
                    });
                }
            });
        };

        $scope.save = function (item) {
            API.call({
                api: 'upd_action_point_package',
                token: token,
                id: item.id,
                production_id: item.production_id,
                price: item.price,
                first_purchase_point: item.first_purchase_point,
                first_purchase_description: item.first_purchase_description,
                point: item.point,
                use_chat: item.use_chat ? true : false,
                use_video_call: item.use_video_call ? true : false,
                use_voice_call: item.use_voice_call ? true : false,
                use_gift: item.use_gift ? true : false,
                use_comment: item.use_comment ? true : false,
                use_sub_comment: item.use_sub_comment ? true : false,
                use_unlock_backstage: item.use_unlock_backstage ? true : false,
                use_save_image: item.use_save_image ? true : false,
                use_other: item.use_other ? true : false,
                chat_text: item.chat_text,
                video_call_text: item.video_call_text,
                voice_call_text: item.voice_call_text,
                gift_text: item.gift_text,
                comment_text: item.comment_text,
                sub_comment_text: item.sub_comment_text,
                unlock_backstage_text: item.unlock_backstage_text,
                save_image_text: item.save_image_text,
                other_text: item.other_text
            }).then(function () {
                Dialog.alert({
                    title: $translate('DIALOG.INFO_TITLE'),
                    message: $translate('SETTINGS.FREE_PAGE.MESSAGE_UPDATE_SUCCESS')
                }).then(function () {
                    item.isEdit = false;
                });
            }, function (errorCode) {
                errorProcess($translate, Dialog, errorCode, item);
            });
        };

        $scope.edit = function (item) {
            item.isEdit = true;
            item.$clone = angular.copy(item);
        };

        $scope.cancel = function (item) {
            var clone = item.$clone;
            delete item.$clone;
            for (var key in clone) {
                item[key] = clone[key];
            }
            item.isEdit = false;
        };
    };

    var messageDataHandle = {
        4: {
            control: '#production_id',
            name: 'SETTINGS.PACKAGE.PAGE_TITLE'
        },
        5: {
            control: '#price',
            name: 'SETTINGS.PACKAGE.PRICE'
        },
        6: {
            control: '#point',
            name: 'SETTINGS.PACKAGE.POINT'
        },
        7: {
            control: '#firstPurchasePoint',
            name: 'SETTINGS.ACTION_PACKAGE.POINT_FIRST'
        },
        8: {
            control: '#chat',
            name: 'SETTINGS.ACTION_PACKAGE.CHAT'
        },
        9: {
            control: '#videoCall',
            name: 'SETTINGS.ACTION_PACKAGE.VIDEO_CAL'
        },
        10: {
            control: '#voiceCall',
            name: 'SETTINGS.ACTION_PACKAGE.VOICE_CALL'
        },
        11: {
            control: '#Gift',
            name: 'SETTINGS.ACTION_PACKAGE.GIFT'
        },
        12: {
            control: '#comment',
            name: 'SETTINGS.ACTION_PACKAGE.COMMENT'
        },
        13: {
            control: '#subcomment',
            name: 'SETTINGS.ACTION_PACKAGE.SUB_COMMENT'
        },
        14: {
            control: '#unlockBackstage',
            name: 'SETTINGS.ACTION_PACKAGE.UNLOCK_BACKSTAGE'
        },
        15: {
            control: '#saveImage',
            name: 'SETTINGS.ACTION_PACKAGE.SAVE_IMAGE'
        },
        16: {
            control: '#other',
            name: 'SETTINGS.ACTION_PACKAGE.OTHERS'
        }
    };

    var errorProcess = function (translate, Dialog, errorCode, item) {
        var data = messageDataHandle[errorCode];
        if (isSet(data)) {
            var name = translate(data.name);
            var control = data.control;

            Dialog.alert({
                title: translate('DIALOG.WARNING_TITLE'),
                message: translate('SETTINGS.FREE_PAGE.FIELD_ERROR', {fieldName: name})
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

    ActionPackageCtrl.$inject = ['$scope', '$translate', 'Session', 'API', 'Dialog'];
    $app.controllers.controller('ActionPackageCtrl', ActionPackageCtrl);
})();
