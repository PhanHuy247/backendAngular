(function() {
  var Dialog = function($q, $translate, Messenger) {
    return {
      alert : function(input) {
        input.type = 'alert';
        return this.show(input);
      },
      confirm : function(input) {
        input.type = 'confirm';
        return this.show(input);
      },
      error : function(errorCode) {
        var input = {
          type : 'alert',
          title : $translate('DIALOG.ERROR_TITLE'),
          message : 'ERR: ' + errorCode
        };

        return this.show(input);
      },
      show : function(input) {
        var deferrer = $q.defer();
        input.deferrer = deferrer;
        Messenger.send('show_dialog', input);

        return deferrer.promise;
      }
    };
  };

  Dialog.$inject = [ '$q', '$translate', 'Messenger' ];
  $app.services.factory('Dialog', Dialog);
})();