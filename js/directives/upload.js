(function() {
  $app.ref.directive('upload', [ '$timeout', '$compile', function($timeout, $compile) {
    return {
      templateUrl : 'partials/directives/upload.html',
      restrict : 'E',
      scope : {
        base64 : '=base64',
        source : '=source',
        ngDisabled : '=ngDisabled',
        ngRequired : '=ngRequired',
        size : '=size',
        form : '@form',
        accept: '=accept',
        limit: '=limit',
        //#11014
        files: '=files',
      },
      controller : [ '$scope', function($scope) {
      } ],
      link : function($scope, element, attrs, ctrl) {
        // set size
        element.css({
          width : $scope.size.width,
          height : $scope.size.height
        });
        var imgArea = element.find('.image-area');
        // var upload = element.find('.upload-trigger');
        var intruction = element.find('.intruction');
        element.find('.image-area .image').on('load', function() {
          imgArea.removeClass('image-loading');
        }).on('error', function() {
          imgArea.removeClass('image-loading');
        });

        // trigger upload input
        $().add(imgArea).add(intruction).on('click', function(e) {
          element.find('.upload-trigger').trigger('click');
        });

        $scope.$watch('base64', function(newValue) {
          if (isUnset(newValue)) {
            imgArea.find('.preview-image').remove();
            createUploadInput();
          }
        });

        //#11014
        $scope.$watch('files', function (newValue) {
          if (isUnset(newValue)) {
            imgArea.find('.preview-image').remove();
            createUploadInput();
          }
        });

        var createUploadInput = function() {
          element.find('.upload-trigger').remove()
          var upload = angular.element('<input class="upload-trigger cursor-pointer image-uploader" type="file" accept="{{accept}}" form="{{form}}" ng-disabled="ngDisabled" ng-required="ngRequired" >');

          $compile(upload)($scope, function(clone, scope) {
            window.uploadscope=$scope;
            element.append(clone);
            // track change
            clone.on('change', function(uploadChangeEvent) {
              var files = uploadChangeEvent.target.files;
              $scope.files = files;//#11014
              // read first file
              var reader = new FileReader();

              if ( (files[0].type !== 'image/png' && files[0].type!= 'image/jpeg' && files[0].type!= 'image/gif') || Math.floor(files[0].size / 1024) > 512) {
                imgArea.find('.preview-image').remove();
                $timeout(function() {
                  if ($scope.base64 != null) {
                    $scope.base64 = null;
                    $scope.files = null;// #11014
                  } else {
                    createUploadInput();
                  }
                });
              } else {

                reader.onload = (function(file) {
                  return function(e) {
                    var imageData = e.target.result;
                    var image = new Image();
                    var checkSize = false;
                    var searchPattern = 'base64,';
                    var index = imageData.indexOf(searchPattern);
                    var base64 = imageData.substr(index + searchPattern.length);
                    image.src = imageData;
                    image.classList.add('preview-image');
                    image.title = file.name;
                    image.onload = function () {
                      imgArea.removeClass('image-loading');
                      if ($scope.limit){
                        var limit_w = $scope.limit.width,
                            limit_h = $scope.limit.height,
                            w = image.naturalWidth,
                            h = image.naturalHeight;
                        if (!((w % limit_w == 0) && (h % limit_h == 0) && (w / limit_w == h / limit_h))){
                          $scope.base64 = base64 = "";
                          $scope.files = files = "";//#11014
                          $scope.$apply();
                        }
                        else {
                          $scope.base64 = base64;
                          $scope.files = files;//#11014
                        }
                      }
                    };
                    image.onerror = function () {
                      imgArea.removeClass('image-loading');
                    };

                    imgArea.find('.preview-image').remove();
                    imgArea.append(image);

                    var searchPattern = 'base64,';
                    var index = imageData.indexOf(searchPattern);
                    var base64 = imageData.substr(index + searchPattern.length);

                    (function(value) {
                      $timeout(function() {
                        $scope.base64 = base64;
                        $scope.files = files;//#11014
                      });
                    })(base64);
                  };
                })(files[0]);
                reader.readAsDataURL(files[0]);
              }
            });
          });
        }
      }
    };
  } ]);
})();