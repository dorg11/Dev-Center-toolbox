var app = angular.module('app', []);
app.controller('a', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/get'
    }).then(function successCallback(response) {
        $scope.webhooks = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
});
app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
