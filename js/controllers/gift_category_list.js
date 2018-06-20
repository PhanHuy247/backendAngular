(function() {
  var GiftCategoryListCtrl = function($scope, $translate, API, Session, Dialog) {
    var token = Session.getAuthority().token;
    // default value
    $scope.input = new Object;

    $scope.properties = {
      size : $app.size.gift,
      activeOrder : false,
      giftCategories : new Array
    };

    $scope.beginOrder = function() {
      $scope.properties.order = true;
    };

    $scope.beginEdit = function(category) {
      category.$clone = angular.copy(category);
      category.isEdit = true;
    };

    $scope.discard = function(category) {
      var clone = category.$clone;
      delete category.$clone;
      for ( var prop in category) {
        category[prop] = clone[prop];
      }
    };

    $scope.save = function(category) {
      API.call({
        api : 'upd_gift_cat',
        token : token,
        cat_id : category.cat_id,
        en_name : category.en_name,
        jp_name : category.jp_name
      }).then(function() {
        category.isEdit = false;

        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.UPDATE_GIFT_CATEGORY_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
      });
    };

    $scope.remove = function(category) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('GIFT_STAMP.MESSAGE.DELETE_GIFT_CATEGORY_CONFIRM')
      }).then(function(result) {
        if (result) {
          if ($scope.flag) return;
          $scope.flag = true;
          API.call({
            api : 'del_gift_cat',
            token : token,
            cat_id : category.cat_id
          }).then(function() {
            var index = $scope.properties.giftCategories.indexOf(category);
            $scope.properties.giftCategories.splice(index, 1);
            $scope.flag = false;
            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('GIFT_STAMP.MESSAGE.DELETE_GIFT_CATEGORY_SUCCEED')
            });
          }, function(code) {
            $scope.flag = false;
            Dialog.error(code);
          });
        }
      });
    };

    $scope.add = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api : 'irs_gift_cat',
        token : token,
        en_name : $scope.input.nameEN,
        jp_name : $scope.input.nameJP
      }).then(function(response) {
        $scope.properties.giftCategories.push({
          cat_id : response.id,
          en_name : $scope.input.nameEN,
          jp_name : $scope.input.nameJP
        });

        // clear input
        $scope.input = new Object;
        $scope.flag = false;
        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.CREATE_GIFT_CATEGORY_SUCCEED')
        });
      }, function(code) {
        $scope.flag = false;
        Dialog.error(code);
      });
    };

    $scope.saveOrder = function(orders) {
      API.call({
        api : 'order_gift',
        token : token,
        type : 1,
        lst_id : orders.byIndex
      }).then(function(response) {
        for (var i = 0; i < $scope.properties.giftCategories.length; i++) {
          $scope.properties.giftCategories[i].order = orders.byKey[$scope.properties.giftCategories[i].cat_id];
        }
        $scope.properties.giftCategories.sortByKey('order');

        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.ORDER_GIFT_CATEGORIES_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
      });
    };

    // load data
    API.call({
      api : 'lst_gift_cat',
      token : token
    }).then(function(response) {
      $scope.properties.giftCategories = response;
    }, function(code) {
      Dialog.error(code);
    });
  };
  GiftCategoryListCtrl.$inject = [ '$scope', '$translate', 'API', 'Session', 'Dialog' ];
  $app.controllers.controller('GiftCategoryListCtrl', GiftCategoryListCtrl);
})();