angular.module('app').controller('instance', function($scope, $http) {
    $scope.instance = {};
    var instance = $scope.instance;
    instance.show = false;
    instance.alreadyParsed = false;
    instance.parse = function() {
        instance.anchor = document.createElement('a');
        instance.anchor.href = instance.page.url;
        instance.data = getParameterByName('instance', instance.anchor.search).split('.');
        instance.before = instance.data[1];
        instance.parsed = JSON.parse(atob(instance.before));
    };
    instance.display = function() {
      if(!instance.alreadyParsed) {
        instance.parse()
      };
      instance.show = !instance.show;
    };
    instance.replace = function() {
        instance.parse()
        if (instance.page.vpi != undefined) {
            instance.parsed.vendorProductId = instance.page.vpi;
        } else {
            instance.page.message = "vendorProductId not provided";
        }
        var signed;
        instance.updated = btoa(JSON.stringify(instance.parsed));
        if (instance.page.secret) {
            $http({
                method: 'GET',
                url: '/sign',
                params: {
                    signature: instance.page.secret,
                    data: instance.updated
                }
            }).then(function successCallback(response) {
                instance.res = instance.page.url.replace(instance.before, instance.updated).replace(instance.data[0], response.data);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
        else {
          instance.page.message = "Secret key must be provided";
        }
    };
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
    instance.select = function() {
        $("textarea").select();
        document.execCommand('copy');
    };
});
