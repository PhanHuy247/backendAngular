var $app = new Object;
$app.appName = 'NationalTrafficSocial';
// $app.apiUrl = 'http://10.64.100.22:9119';
// $app.imageUrl = 'http://10.64.100.22:9117';

$app.apiUrl = 'http://210.148.155.5:9119';
$app.imageUrl = 'http://210.148.155.5:9117';

$app.controllers = angular.module('controllers', []);
$app.services = angular.module('services', [ 'ngResource' ]);
$app.filters = angular.module('filters', []);
$app.timezone = Date.timezone();