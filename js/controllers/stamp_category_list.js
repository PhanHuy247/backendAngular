(function() {
  var StampCategoryListCtrl = function($scope, $q, $translate, API, Session, Dialog) {
    var token = Session.getAuthority().token;
    $scope.flag = false;
    $scope.properties = {
      size : $app.size.sticker,
      activeOrder : false,
      stampCategories : new Array(),
      textareaHeight : 3,
      categoryTypes : [ {
        value : 0,
        label : $translate('GIFT_STAMP.INFO.STAMP_TYPES.DEFAULT')
      }, {
        value : 1,
        label : $translate('GIFT_STAMP.INFO.STAMP_TYPES.FREE')
      }, {
        value : 2,
        label : $translate('GIFT_STAMP.INFO.STAMP_TYPES.NON_FREE')
      } ]
    };

    $scope.input = {
      type : $scope.properties.categoryTypes[1].value,
      price : 0
    };

    $scope.setFreePrice = function(category) {
      if (category.type === $scope.properties.categoryTypes[0].value) {
        category.price = 0;
      }
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
      var queue = new Array;

      queue.push(API.call({
        api : 'upd_stk_cat',
        token : token,
        id : category.cat_id,
        price : parseFloatNullable(category.price),
        type : category.type,
        jp_name : category.jp_name,
        en_name : category.en_name,
        jp_des : category.jp_des,
        en_des : category.en_des
      }));

      if (isSet(category.base64)) {
        queue.push(API.call({
          api : 'upd_stk_cat_img',
          token : token,
          id : category.cat_id,
          img : category.base64
        }));
      }

      $q.all(queue).then(function(response) {
        if (isSet(category.base64)) {
          delete category.base64;
          // refresh gift.imageSrc
          category.imgSrc = generateImageUrl(category.cat_id);
        }

        category.isEdit = false;
        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.UPDATE_STAMP_CATEGORY_SUCCEED')
        })
      }, function(code) {
        Dialog.error(code);
      });
    };

    $scope.remove = function(category) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('GIFT_STAMP.MESSAGE.DELETE_STAMP_CATEGORY_CONFIRM')
      }).then(function(result) {
        if (result) {
          API.call({
            api : 'del_stk_cat',
            token : token,
            id : category.cat_id
          }).then(function(response) {
            var index = $scope.properties.stampCategories.indexOf(category);
            $scope.properties.stampCategories.splice(index, 1);

            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('GIFT_STAMP.MESSAGE.DELETE_STAMP_CATEGORY_SUCCEED')
            });
          }, function(code) {
            Dialog.error(code);
          });
        }
      });
    };
    
    $scope.add = function() {
      if ($scope.flag) return;
      $scope.flag = true;
      API.call({
        api : 'isr_stk_cat',
        token : token,
        jp_name : $scope.input.jp_name,
        jp_des : $scope.input.jp_des,
        en_name : $scope.input.en_name,
        en_des : $scope.input.en_des,
        price : parseFloatNullable($scope.input.price),
        type : $scope.input.type,
        img : $scope.input.base64
      }).then(function(response) {
        var newCategory = angular.copy($scope.input);
        newCategory.cat_id = response.id;
        newCategory.imgSrc = generateImageUrl(response.id);
		newCategory.stk_num = 0;
        delete newCategory.base64;

        $scope.properties.stampCategories.push(newCategory);

        $scope.input = {
          type : $scope.properties.categoryTypes[0].value,
          price : 0
        };

        $scope.flag = false;
        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.CREATE_STAMP_CATEGORY_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
        $scope.flag = false;
      });
    };
    
    $scope.isEditedPrice =  function (category){
      return !category.isEdit || category.type !== $scope.properties.categoryTypes[1].value;
    };

    API.call({
      api : 'lst_stk_cat',
      token : token
    }).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        response[i].imgSrc = generateImageUrl(response[i].cat_id);
      }

      $scope.properties.stampCategories = response;

    }, function(code) {
      Dialog.error(code);
    });

    var generateImageUrl = function(id) {
      return $app.imageUrl + '/api=load_img_admin&token=' + token + '&img_id=' + id + '&img_kind=5#' + Date.now().getTime();
    };
  };

  StampCategoryListCtrl.$inject = [ '$scope', '$q', '$translate', 'API', 'Session', 'Dialog' ];

  $app.controllers.controller('StampCategoryListCtrl', StampCategoryListCtrl);
})();