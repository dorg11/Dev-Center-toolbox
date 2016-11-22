angular.module('app').controller('hive', function($scope, $http) {

    $scope.hive = {};
    var hive = $scope.hive;
    console.log(hive);
    hive.url = 'https://openapi.wix.com/v1';
    hive.showObject = function() {
        console.log(hive);
    }
    hive.sendHiveGet = function() {
        $http({
            method: "GET",
            url: '/hiveGet?appId=' + hive.appId + '&instanceId=' + hive.instanceId + '&secretKey=' + hive.secretKey + '&relativeUrl=/v1' + hive.relativeUrl,
        }).then(function mySucces(response) {
            hive.response = response.data;
        }, function myError(response) {
            hive.response = response.statusText;
        });
    };
});
