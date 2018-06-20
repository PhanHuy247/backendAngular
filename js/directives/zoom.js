(function() {
  var responseInterval = 10;
  var timeout;

  $app.ref.directive('zoom', ['$translate', function($translate) {
      var ImgBox = function(image) {
        this.image = image;
      };

      ImgBox.prototype = new Object;
      ImgBox.prototype.adjust = function() {
        this.body.style.lineHeight = this.body.offsetHeight + 'px';
      };
      
      ImgBox.prototype.show = function() {
        this.overlay = document.createElement('overlay');

        var closeButton = $('<button />').addClass('btn').addClass('btn-info').text($translate('DIALOG.CLOSE'));

        (function(box, btn) {
          btn.on('click', function() {
            box.close();
          });
        })(this, closeButton);

        var footer = $('<div />').append(closeButton);
        $(footer).addClass('footer').addClass('text-right');

        if (isFunction(this.image.$checkImageStatus) && isFunction(this.image.$reviewImage)) {
          (function(img, footer) {
            var extraButton = $('<button />').addClass('btn').addClass('btn-danger');
            img.$checkImageStatus().then(function(stt) {
              img.img_stt = stt;
              
              // if denied image
              if (img.img_stt === -1) {
                extraButton.attr('disabled', true).text($translate('REPORT.APPROVE_DENY_IMAGE.DENIED'));
              } else {
                extraButton.text($translate('REPORT.APPROVE_DENY_IMAGE.DENY'));
              }
              
              footer.append(extraButton);

              extraButton.on('click', function() {
                img.$reviewImage().then(function(res) {
                  $('.btn-danger').empty().attr('disabled', true).text($translate('REPORT.APPROVE_DENY_IMAGE.DENIED'));
                });
              });
            });
          })(this.image, footer);
        }

        this.body = $('<div />').addClass('body').addClass('text-center')[0];

        this.img = new Image();
        this.img.src = this.image.$imgSrc;

        (function(box) {
          box.img.onload = function() {
            box.adjust();
          };
        })(this);

        $(this.body).append(this.img);

        // append view
        $(this.overlay).append(this.body);
        $(this.overlay).append(footer);
        document.body.appendChild(this.overlay);

        (function(box) {
          box.resizeHandler = $(window).on('resize', function(e) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              box.adjust();
            }, responseInterval);
          });
        })(this);
      };
      ImgBox.prototype.close = function() {
        $(window).off('resize', this.resizeHandler);
        $(this.overlay).remove();
      };

      return {
        templateUrl: 'partials/directives/zoom.html',
        restrict: 'E',
        scope: {
          ngImage: '=ngImage',
          showImage: '=showImage'
        },
        link: function($scope, element, attrs) {
          element.on('click', function() {
            new ImgBox($scope.ngImage).show();
          });
        }
      };
    }]);
})();