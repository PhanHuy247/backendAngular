/**
 * Created by QuyDao on 16/05/2017.
 */
(function(){
    var UserInfoManagementCtrl = function($scope, $modal, $translate, Session, API, Dialog){
      var token = Session.getAuthority().token;
      $scope.info_user_management = {};
      $scope.setting = {
        numberPagesDisplay : $app.pageDisplay,
        itemsPerPage : $app.pageSize,
        currentPage : 1,
        totalItems : 0
      };
      // built sort filter
      $scope.attributes = {
        gender : $app.labels.get('genders', true),
        sortBys : [ {
            value : 1,
            label : $translate('REPORT.APPROVE_DENY_IMAGE.UPLOAD_TIME')
        }, {
            value : 2,
            label : $translate('REPORT.APPROVE_DENY_IMAGE.REVIEW_TIME')
        } ],
        orderBys: $app.labels.get('orderBys')
      };

      $scope.info_user_management.sortBy = $scope.attributes.sortBys[0].value;
      $scope.info_user_management.isPending = true;
      $scope.info_user_management.orderBy = $scope.attributes.orderBys[0].value;

      $scope.searchInfoUser = function() {
        $scope.setting.totalItems = 0;
        $scope.setting.currentPage = 1;
        $scope.loadInfoUserData($scope.setting.currentPage);
      };

      $scope.loadInfoUserData = function(page){
        var reqDataSearchInfoUser = {
          api : 'get_review_user',
          token : token,
          id : $scope.info_user_management.id,
          order : parseIntNullable($scope.info_user_management.orderBy),
          sort : parseIntNullable($scope.info_user_management.sortBy),
          skip : (page - 1) * $scope.setting.itemsPerPage,
          take : $scope.setting.itemsPerPage
        };
        API.call(reqDataSearchInfoUser).then(function(data) {
          $("html, body").animate({
            scrollTop: $("#block-center-screen").position().top
          }, 1000);
          $scope.listInfoUserData = data.list;
          $scope.setting.totalItems = data.total;

          $scope.flagApprove = 1;
          $scope.flagDeny = -1;

          $scope.buttonLeft = 'btn btn-danger';
          $scope.buttonRight = 'btn btn-primary';

          $scope.labelButtonLeft = $translate('REPORT.APPROVE_DENY_IMAGE.DENY');
          $scope.labelButtonRight = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVE');

          $scope.labelButtonLeftAll = $translate('REPORT.INFO_USER_MANAGEMENT.DENY_ALL');
          $scope.labelButtonRightAll = $translate('REPORT.INFO_USER_MANAGEMENT.APPROVE_ALL');

          $scope.labelApply = $translate('REPORT.INFO_USER_MANAGEMENT.APPLY');
          $scope.labelCancel = $translate('REPORT.INFO_USER_MANAGEMENT.CANCEL');


        }, function(errorCode) {
          Dialog.error(errorCode);
        });

      };
      $scope.loadInfoUserData(1);

      $scope.checkReviewedAll = function(item) {
        var flagEnable = true;
        if (item.statusChecked.all) {
          return true;
        }

        if ((item.about && !item.statusChecked.about) || (item.hobby && !item.statusChecked.hobby)
          || (item.fetish && !item.statusChecked.fetish) || (item.type_of_man && !item.statusChecked.type_of_man)) {
          flagEnable = false;
        } else {
          var flagDeny = true;
          var flagApprove = true;

          angular.forEach(item.statusChecked, function(value, key) {
            if (value.status === 1) {
              flagDeny = false;
            } else {
              flagApprove = false;
            }
          });

          if (flagApprove === false && flagDeny === false) {
            item.statusChecked.checkedAll = {
              statusName : $translate('REPORT.APPROVE_DENY_IMAGE.CHECKED_ALL')
            };
          } else {
            if (flagApprove === true) {
              item.statusChecked = {};
              item.statusChecked.all = {
                labelSuccess : true,
                status : 1,
                statusName : $translate('REPORT.APPROVE_DENY_IMAGE.APPROVED')
              };
            }
            if (flagDeny === true) {
              item.statusChecked = {};
              item.statusChecked.all = {
                labelImportant : true,
                status : -1,
                statusName : $translate('REPORT.APPROVE_DENY_IMAGE.DENIED')
              };
            }
          }
        }
        return flagEnable;
      }

      $scope.changeStatusInfoUser = function(status, item, field) {

        if(!item.hasOwnProperty('statusChecked')) {
          item.statusChecked = {};
        }
        item.statusChecked[field] = {};

        var statusName = '';
        switch (status) {
          case 1:
            statusName = $translate('REPORT.APPROVE_DENY_IMAGE.APPROVED');
            item.statusChecked[field].labelSuccess = true;
            break;
          case -1:
            statusName = $translate('REPORT.APPROVE_DENY_IMAGE.DENIED');
            item.statusChecked[field].labelImportant = true;
            break;
        }

        item.statusChecked[field].status = status;
        item.statusChecked[field].statusName = statusName;
        item.enableCancel = true;
        item.enableApply = $scope.checkReviewedAll(item);
      };
      $scope.apply = function(status, item) {
        if(status == -1) {
          item.statusChecked = {};
          item.enableCancel = false;
          item.enableApply = false;
          return;
        }
        var reqChangeStatusInfoUser = {
            api : 'review_user',
            token : token,
            id : item.user_id
          };
        if (item.statusChecked.all) {

          var statusChecked = item.statusChecked.all.status;
          reqChangeStatusInfoUser.about = item.about ? statusChecked : null;
          reqChangeStatusInfoUser.hobby = item.hobby ? statusChecked : null;
          reqChangeStatusInfoUser.type_of_man = item.type_of_man ? statusChecked : null;
          reqChangeStatusInfoUser.fetish = item.fetish ? statusChecked : null;

        } else {

          reqChangeStatusInfoUser.about =  item.about ? item.statusChecked.about.status : null;
          reqChangeStatusInfoUser.hobby = item.hobby ? item.statusChecked.hobby.status : null;
          reqChangeStatusInfoUser.type_of_man = item.type_of_man ? item.statusChecked.type_of_man.status : null;
          reqChangeStatusInfoUser.fetish = item.fetish ? item.statusChecked.fetish.status : null;

        }
        API.call(reqChangeStatusInfoUser).then(function() {
          item.statusChecked.applied = {
            statusName : $translate('REPORT.APPROVE_DENY_IMAGE.APPLIED')
          }
        }, function(errorCode) {
          Dialog.error(errorCode);
        });
      }
    };
    UserInfoManagementCtrl.$inject = ['$scope', '$modal', '$translate', 'Session', 'API', 'Dialog'];
    $app.controllers.controller('UserInfoManagementCtrl',UserInfoManagementCtrl);
})();
