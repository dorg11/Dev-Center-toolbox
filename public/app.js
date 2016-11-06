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
app.controller('change', function($scope, $http) {
    $scope.parse = function() {
        var parser = document.createElement('a');
        parser.href = $scope.url;
        var query = parser.search;
        $scope.instance = getParameterByName('instance', query).split('.');
        $scope.old = $scope.instance[1];
        console.log($scope.old);
        return JSON.parse(atob($scope.old));
    };
    $scope.replace = function() {
      var instance = $scope.parse();
      if ($scope.vpi != undefined) {
          instance.vendorProductId = $scope.vpi;
      } else {
          $scope.message = "vendorProductId not provided";
      }
      var signed;
      if ($scope.secret) {
        $http({
            method: 'GET',
            url: '/sign',
            params: {signature: $scope.instance[0], data: btoa(JSON.stringify(instance))}
        }).then(function successCallback(response) {
            var updated = btoa(JSON.stringify(instance));
            $scope.res = $scope.url.replace($scope.old, updated).replace($scope.instance[0], response.data);
        }, function errorCallback(response) {
            console.log(response);
        });
      }
    };
    $scope.showInstance = function() {
      $scope.instance = $scope.parse();
    }
    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    $scope.select = function() {
      $("textarea").select();
      document.execCommand('copy');
    };
});
app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
