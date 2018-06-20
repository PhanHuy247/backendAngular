(function() {
  $app.ref.directive('videogularArea', ['$sce', function($sce) {
    return {
      templateUrl : 'partials/directives/video.html',
      restrict : 'AE',
      scope : {
        source : '=source'
      },
      link : function($scope) {
        $scope.config = {
          preload: "none",
          sources: [
            {src: $sce.trustAsResourceUrl($scope.source), type: "video/mp4"}
          ],
          tracks: [
            {
              src: "assets/subs/pale-blue-dot.vtt",
              kind: "subtitles",
              srclang: "en",
              label: "English",
              default: ""
            }
          ],
          theme: {
            url: "css/videogular.css"
          },
          plugins: {
            controls: {
              autoHide: false
            }
          }
        };
      }
    };
  } ]);
})();