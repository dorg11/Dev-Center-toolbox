angular.module('app').controller('hive', function($scope, $http) {

    $scope.hive = {};
    var hive = $scope.hive;
    console.log(hive);
    hive.url = 'https://openapi.wix.com/v1';
    hive.showObject = function() {
        console.log(hive);
    }
    hive.sendHiveGet = function() {
        hive.getUrl = '/hiveGet?appId=' + hive.appId +
        '&instanceId=' + hive.instanceId +
        '&secretKey=' + hive.secretKey +
        '&relativeUrl=/v1' + hive.relativeUrl + (hive.queryParams.length > 0 ? '&queryParams=' + angular.toJson(hive.queryParams) : '') +
        '&requestType=' + hive.requestType +
        (hive.postBody.length > 0 ? '&postBody=' + angular.toJson(hive.postBody) : '');
        $http({
            method: "GET",
            url: hive.getUrl,
        }).then(function mySucces(response) {
            hive.response = response.data;
        }, function myError(response) {
            hive.response = response.statusText;
        });
    };
    hive.requestTypes = ['GET', 'POST', 'PUT'];
    hive.request = {
        "GET": ['/contacts', '/contacts/search', '/contacts/mailingList', '/activities', '/activities/types', '/labels', '/sites/site', '/sites/site/contributors', '/sites/site/pages', '/sites/site/settings', '/service/actions/email/providers', '/billing/products', '/billing/active', '/redirects'],
        "POST": ['/contacts', '/activities', '/labels', '/notifications', '/services/actions/email', '/services/actions/email/single', '/services/actions/done', '/bulk/contacts', '/batch'],
        "PUT": ['NOT SUPPORTED CURRENTLY']
    }
    hive.postBody = [];
    hive.queryParams =[];
    hive.addQueryParam = function() {
      hive.queryParams.push({});
    }
    hive.removeQueryParam = function(obj) {
        hive.queryParams.splice(hive.queryParams.indexOf(obj), 1);
    }
    hive.addBodyObj = function() {
        hive.postBody.push({});
    }
    hive.removeBodyObj = function(obj) {
        hive.postBody.splice(hive.postBody.indexOf(obj), 1);
    }
});
