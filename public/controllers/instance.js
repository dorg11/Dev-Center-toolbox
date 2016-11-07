angular.module('app').controller('instance', function($scope, $http) {

  
    $scope.parse = function() {
        var parser = document.createElement('a');
        parser.href = $scope.url;
        var query = parser.search;
        $scope.instance = getParameterByName('instance', query).split('.');
        $scope.old = $scope.instance[1];
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
        var updated = btoa(JSON.stringify(instance));
        if ($scope.secret) {
            $http({
                method: 'GET',
                url: '/sign',
                params: {
                    signature: $scope.secret,
                    data: updated
                }
            }).then(function successCallback(response) {
                $scope.res = $scope.url.replace($scope.old, updated).replace($scope.instance[0], response.data);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    };
    $scope.showInstance = function() {
        $scope.parsed = $scope.parse();
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