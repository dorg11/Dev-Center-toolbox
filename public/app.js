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
app.controller('change', function($scope) {
    $scope.parse = function() {
        var parser = document.createElement('a');
        parser.href = $scope.url;
        var query = parser.search;
        var old = getParameterByName('instance', query).split('.')[1];
        return JSON.parse(atob(old));
    };
    $scope.replace = function() {
      var instance = $scope.parse();
      if ($scope.vpi != undefined) {
          instance.vendorProductId = $scope.vpi;
      } else {
          $scope.message = "vendorProductId not provided";
      }
      var updated = btoa(JSON.stringify(instance));
      $scope.res = $scope.url.replace(old, updated);
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

    };
});
app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
