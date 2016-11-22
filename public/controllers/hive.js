angular.module('app').controller('hive', function($scope, $http) {

  $scope.hive = {};
  var hive = $scope.hive;
  console.log(hive);
  hive.url = 'https://openapi.wix.com/v1';
  hive.showObject = function() {
    console.log(hive);
  }
  hive.getSignature = function() {
    hive.timeStamp = new Date();
    hive.timeStamp.toISOString();
    $http({
      method : "GET",
      url : '/hiveSign?appId='+hive.appId+'&instanceId='+hive.instanceId+'&timeStamp='+hive.timeStamp+'&secretKey='+hive.secretKey+'&relativeUrl=/v1'+hive.relativeUrl,
    }).then(function mySucces(response) {
      hive.request = response.data;
    }, function myError(response) {
      $scope.request = response.statusText;
    });
  };

  hive.makeRequest = function() {
    $http({
      method : "GET",
      url : hive.url+hive.relativeUrl,
      headers : {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin',
        'x-wix-application-id':hive.appId,
        'x-wix-instance-id':hive.instanceId,
        'x-wix-timestamp':hive.timeStamp,
        'x-wix-signature':hive.signature //signature that my server generated (equal sign is tossed)
      }
    }).then(function mySucces(response) {
      hive.request = response.data;
    }, function myError(response) {
      $scope.request = response.statusText;
    });
  }


});
