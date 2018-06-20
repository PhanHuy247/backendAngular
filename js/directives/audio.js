(function() {
  $app.ref.directive('audiogularArea', ['$sce', function($sce) {
    return {
      templateUrl : 'partials/directives/audio.html',
      restrict : 'AE',
      scope : {
        source : '=source'
      },
      link : function($scope) {
        $scope.config = {
        sources: [
              {src: $sce.trustAsResourceUrl($scope.source), type: "audio/mpeg"},
          ],
        theme: {
          url: "css/videogular.css"
        }
      };
      }
    };
  } ]);
})();