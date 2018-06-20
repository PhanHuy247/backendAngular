(function() {
  var GiftListCtrl = function($scope, $routeParams, $translate, $q, API, Session, Dialog) {
    var catId = $routeParams.id;
    var token = Session.getAuthority().token;
    // default value
    $scope.input = new Object;

    $scope.properties = {
      size : $app.size.gift,
      activeOrder : false,
      giftCategories : new Array,
      size : $app.size.gift,
      textareaHeight : 3
    };
    console.log($scope.properties);

    $scope.beginOrder = function() {
      $scope.properties.order = true; 
    };

    $scope.beginEdit = function(gift) {
      gift.$clone = angular.copy(gift);
      gift.isEdit = true;
    };

    $scope.discard = function(gift) {
      var clone = gift.$clone;
      delete gift.$clone;
      for ( var prop in gift) {
        gift[prop] = clone[prop];
      }
    };

    $scope.save = function(gift) {
      var queue = new Array;

      queue.push(API.call({
        api : 'upd_gift',
        token : token,
        gift_id : gift.id,
        gift_pri : parseFloatNullable(gift.gift_pri),
        gift_inf : gift.gift_inf,
        en_name : gift.en_name,
        jp_name : gift.jp_name
      }));

      if (isSet(gift.base64)) {
        queue.push(API.call({
          api : 'upd_gift_img',
          token : token,
          gift_id : gift.id,
          img : gift.base64
        }));
      }

      $q.all(queue).then(function(response) {
        if (isSet(gift.base64)) {
          gift.base64 = null;
          // refresh gift.imageSrc
          gift.imgSrc = generateImageUrl(gift.id);
        }

        gift.isEdit = false;
        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.UPDATE_GIFT_SUCCEED')
        })
      }, function(code) {
        Dialog.error(code);
      });
    };

    $scope.remove = function(gift) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('GIFT_STAMP.MESSAGE.DELETE_GIFT_CONFIRM')
      }).then(function(result) {
        if (result) {
          API.call({
            api : 'del_gift',
            token : token,
            gift_id : gift.id
          }).then(function() {
            var index = $scope.properties.gifts.indexOf(gift);
            $scope.properties.gifts.splice(index, 1);

            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('GIFT_STAMP.MESSAGE.DELETE_GIFT_SUCCEED')
            });
          }, function(code) {
            Dialog.error(code);
          });
        }
      });
    };

    $scope.add = function() {
      API.call({
        api : 'irs_gift',
        token : token,
        cat_id : catId,
        en_name : $scope.input.nameEN,
        jp_name : $scope.input.nameJP,
        gift_pri : parseFloatNullable($scope.input.price),
        gift_inf : $scope.input.info,
        img : $scope.input.base64
      }).then(function(response) {
        //console.log(response);
        $scope.properties.gifts.push({
          id : response.id,
          en_name : $scope.input.nameEN,
          jp_name : $scope.input.nameJP,
          gift_inf : $scope.input.info,
          gift_pri : parseFloatNullable($scope.input.price),
          imgSrc : generateImageUrl(response.id)
        });

        // clear input
        $scope.input = new Object;

        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.CREATE_GIFT_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
      })
    };

    $scope.saveOrder = function(orders) {
      API.call({
        api : 'order_gift',
        token : token,
        type : 2,
        lst_id : orders.byIndex
      }).then(function(response) {
        for (var i = 0; i < $scope.properties.gifts.length; i++) {
          $scope.properties.gifts[i].order = orders.byKey[$scope.properties.gifts[i].id];
        }
        $scope.properties.gifts.sortByKey('order');

        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.ORDER_GIFTS_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
      });
    };

    // load data
    API.call({
      api : 'lst_gift',
      cat_id : catId,
      token : token
    }).then(function(response) {
      $scope.properties.category = response.gift_cat;

      for (var i = 0; i < response.list.length; i++) {
        response.list[i].imgSrc = generateImageUrl(response.list[i].id);
      }

      $scope.properties.gifts = response.list;
    }, function(code) {
      Dialog.error(code);
    });

    var generateImageUrl = function(id) {
      return $app.imageUrl + '/api=load_img_admin&token=' + token + '&img_id=' + id + '&img_kind=4#' + Date.now().getTime();
    }
  };
  GiftListCtrl.$inject = [ '$scope', '$routeParams', '$translate', '$q', 'API', 'Session', 'Dialog' ];
  $app.controllers.controller('GiftListCtrl', GiftListCtrl);
})();