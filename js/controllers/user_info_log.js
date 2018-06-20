(function () {
    var UserInfoLogCtrl = function ($scope, $location, $translate, $modal, Session, API, Dialog, CSV) {
      var token = Session.getAuthority().token;
      console.log(location);

      $scope.info_user = {};
      $scope.setting = {
        numberPagesDisplay : $app.pageDisplay,
        itemsPerPage : $app.pageSize,
        currentPage : 1,
        totalItems : 0
      };

        $scope.properties = {
        // list_logs: $app.labels.get('lisLogs'),
        user_type: $app.labels.get('userTypes', false),
        gender: $app.labels.get('genders'),
      };
     //  // console.log($scope.properties.gender)
     $scope.user_info = {
        // list_logs: $scope.properties.list_logs[0].value,
        user_type : $scope.properties.user_type[0].value,
        gender: $scope.properties.gender[0].value,
      };
      console.log($scope.user_info.gender)
      var selectUserType = {
        0 : "email",
        1 : "fb_id",
        2 : "mocom_id",
        3 : "famu_id"
      };
      // check pending
      // $scope.user_info.isPending = true;
      // $scope.user_info.sortBy = $scope.attributes.sortBys[0].value;
     //    $scope.user_info.orderBy = $scope.attributes.orderBys[0].value;
        // search info users
        $scope.searchInfoUsers = function() {
          $scope.setting.totalItems = 0;
          $scope.setting.currentPage = 1;
          $scope.loadInfoUsersData($scope.setting.currentPage);
        };


        // call API send data to server
        $scope.loadInfoUsersData = function(page){
          var resDataSearchInfoUser = {
            api : 'get_log_user_info',
            token : token,
            id : $scope.user_info.id,
            application_id: $scope.user_info.app_id,
            time: $scope.user_info.time,
            gender: $scope.user_info.gender,
            user_type: $scope.user_info.user_type,
            order : 1,
            sort : 1,
            skip : (page - 1) * $scope.setting.itemsPerPage,
            take : $scope.setting.itemsPerPage
          };
          resDataSearchInfoUser[selectUserType[$scope.user_info.user_type]] = $scope.user_info[selectUserType[$scope.user_info.user_type]];

          // console.log($scope.user_info.gender)

          API.call(resDataSearchInfoUser).then(function(data) {
            // console.log("3456789")
            // console.log(data)
            $scope.listInfoUserData = data.list;
            $scope.setting.totalItems = data.total;
            $scope.flagApprove = 1;
              $scope.flagDeny = -1;

              $scope.buttonLeft = 'btn btn-danger';
              $scope.buttonRight = 'btn btn-primary';

              $scope.labelButtonLeft = $translate('LOG.USER_INFO.LB_DENY');
              $scope.labelButtonRight = $translate('LOG.USER_INFO.LB_APPROVE');

              $scope.labelButtonLeftAll = $translate('LOG.USER_INFO.LB_DENY_ALL');
              $scope.labelButtonRightAll = $translate('LOG.USER_INFO.LB_APPROVE_ALL');

              $scope.labelApply = $translate('LOG.USER_INFO.LB_APPLY');
              $scope.labelCancel = $translate('LOG.USER_INFO.LB_CANCEL');
          }, function(errorCode) {
            Dialog.error(errorCode);
          });
          // console.log("3456789")
      }
      $scope.loadInfoUsersData(1);

      

       // check apply all
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
              statusName : $translate('LOG.USER_INFO.LB_CHECKED_ALL')
            };
          } else {
            if (flagApprove === true) {
              item.statusChecked = {};
              item.statusChecked.all = {
                labelSuccess : true,
                status : 1,
                statusName : $translate('LOG.USER_INFO.LB_APPROVED')
              };
            }
            if (flagDeny === true) {
              item.statusChecked = {};
              item.statusChecked.all = {
                labelImportant : true,
                status : -1,
                statusName : $translate('LOG.USER_INFO.LB_DENIED')
              };
            }
          }
        }
        return flagEnable;
      }

      // change status approved or denied
      $scope.changeStatusInfoUser = function(status, item, field) {

        if(!item.hasOwnProperty('statusChecked')) {
          item.statusChecked = {};
        }
        item.statusChecked[field] = {};

        var statusName = '';
        switch (status) {
          case 1:
            statusName = $translate('LOG.USER_INFO.LB_APPROVED');
            item.statusChecked[field].labelSuccess = true;
            break;
          case -1:
            statusName = $translate('LOG.USER_INFO.LB_DENIED');
            item.statusChecked[field].labelImportant = true;
            break;
        }

        item.statusChecked[field].status = status;
        item.statusChecked[field].statusName = statusName;
        item.enableCancel = true;
        item.enableApply = $scope.checkReviewedAll(item);
      };

      // test
      $scope.demo = function() {
        // alert("456789")
        var dataDemo = {
            api : 'review_user',
            token : token,
            
          };
          API.call(dataDemo).then(function(data) {
            console.log(data)
          }, function(errorCode) {
            Dialog.error(errorCode);
          });
      }
      // end_test

      // apply or cancel
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
            statusName : $translate('LOG.USER_INFO.LB_APPLIED')
          }
        }, function(errorCode) {
          Dialog.error(errorCode);
        });
      }
      
    };
   

    UserInfoLogCtrl.$inject = ['$scope', '$location', '$translate', '$modal', 'Session', 'API', 'Dialog', 'CSV'];
    $app.controllers.controller('UserInfoLogCtrl', UserInfoLogCtrl);
})();

