var myApp = angular.module('myApp', []);

myApp.controller('MyController', ['$scope', '$http', function ($scope, $http) {
    $http.post('/analyze', '{ "site": "abc.com"}').success(function(data) {
        $scope.scrapedPages = data;
    });
}]);