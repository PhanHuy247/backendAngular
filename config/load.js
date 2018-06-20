(function() {
  window.addEventListener('load', function() {
    var loader = new createjs.LoadQueue();

    loader.addEventListener('fileload', function(event) {
      document.body.appendChild(event.result);
    });

    loader.addEventListener('complete', function() {
      angular.bootstrap(document, manifest.applicationNames);
    });

    loader.loadManifest(manifest);
  }, false);
})();