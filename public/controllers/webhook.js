angular.module('app').controller('webhook', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/get'
    }).then(function successCallback(response) {
        $scope.webhooks = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
});
