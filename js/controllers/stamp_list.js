(function() {
  var StampListCtrl = function($scope, $routeParams, $translate, API, Session, Dialog) {
    var token = Session.getAuthority().token;

    $scope.properties = {
      size : $app.size.sticker,
      activeOrder : false,
      categoryTypes : {
        0 : 'GIFT_STAMP.INFO.STAMP_TYPES.DEFAULT',
        1 : 'GIFT_STAMP.INFO.STAMP_TYPES.FREE',
        2 : 'GIFT_STAMP.INFO.STAMP_TYPES.NON_FREE'
      },
      input : {}
    };

    $scope.beginEdit = function(stamp) {
      stamp.$clone = angular.copy(stamp);
      stamp.isEdit = true;
    };

    $scope.discard = function(stamp) {
      var clone = stamp.$clone;
      delete stamp.$clone;
      for ( var prop in stamp) {
        stamp[prop] = clone[prop];
      }
    };

    $scope.remove = function(stamp) {
      Dialog.confirm({
        title : $translate('DIALOG.CONFIRM_TITLE'),
        message : $translate('GIFT_STAMP.MESSAGE.DELETE_STAMP_CONFIRM')
      }).then(function(result) {
        if (result) {
          API.call({
            api : 'del_stk',
            token : token,
            id : stamp.id
          }).then(function(response) {
            var index = $scope.properties.stamps.indexOf(stamp);
            $scope.properties.stamps.splice(index, 1);

            Dialog.alert({
              title : $translate('DIALOG.INFO_TITLE'),
              message : $translate('GIFT_STAMP.MESSAGE.DELETE_STAMP_SUCCEED')
            });
          }, function(code) {
            Dialog.error(code);
          });
        }
      })
    };

    $scope.save = function(stamp) {
      API.call({
        api : 'upd_stk_img',
        token : token,
        id : stamp.id,
        img : stamp.base64
      }).then(function() {
        stamp.imgSrc = generateImageUrl(stamp.code);
        stamp.isEdit = false;
        stamp.base64 = null;
        delete stamp.$clone;

        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.UPDATE_STAMP_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
      });
    };
	var clickOne = false;
    $scope.add = function() {
	  if (!clickOne) {
		clickOne = true;
		
		API.call({
		  api : 'isr_stk',
		  token : token,
		  cat_id : $routeParams.id,
		  img : $scope.properties.input.base64
		}).then(function(response) {
		  $scope.properties.stamps.push({
			cat_id : $routeParams.id,
			code : response.code,
			id : response.id,
			imgSrc : generateImageUrl(response.code)
		  });

		  $scope.properties.input = new Object;

		  Dialog.alert({
			title : $translate('DIALOG.INFO_TITLE'),
			message : $translate('GIFT_STAMP.MESSAGE.CREATE_STAMP_SUCCEED')
		  });
		  clickOne = false;
		}, function(code) {
		  clickOne = false;
		  Dialog.error(code);
		});
	  }
    };

    $scope.saveOrder = function(orders) {
      API.call({
        api : 'order_stk',
        token : token,
        lst_id : orders.byIndex
      }).then(function(response) {
        for (var i = 0; i < $scope.properties.stamps.length; i++) {
          $scope.properties.stamps[i].order = orders.byKey[$scope.properties.stamps[i].id];
        }
        $scope.properties.stamps.sortByKey('order');

        Dialog.alert({
          title : $translate('DIALOG.INFO_TITLE'),
          message : $translate('GIFT_STAMP.MESSAGE.ORDER_STAMPS_SUCCEED')
        });
      }, function(code) {
        Dialog.error(code);
      });
    };

    API.call({
      api : 'lst_stk',
      token : token,
      cat_id : $routeParams.id
    }).then(function(response) {
      for (var i = 0; i < response.list.length; i++) {
        response.list[i].imgSrc = generateImageUrl(response.list[i].code);
      }

      $scope.properties.category = response.stk_cat;
      $scope.properties.stamps = response.list;
    }, function(code) {
      Dialog.error(code);
    });

    var generateImageUrl = function(id) {
      return $app.imageUrl + '/api=load_img_admin&token=' + token + '&img_id=' + id + '&img_kind=3&t=' + Date.now().getTime();
    }
  };
  StampListCtrl.$inject = [ '$scope', '$routeParams', '$translate', 'API', 'Session', 'Dialog' ];

  $app.controllers.controller('StampListCtrl', StampListCtrl);
})();