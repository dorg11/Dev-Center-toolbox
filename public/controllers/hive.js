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
            url: '/hiveGet?appId=' + hive.appId + '&instanceId=' + hive.instanceId + '&secretKey=' + hive.secretKey + '&relativeUrl=/v1' + hive.relativeUrl + '&queryParams=' + hive.queryParams,
        }).then(function mySucces(response) {
            hive.response = response.data;
        }, function myError(response) {
            hive.response = response.statusText;
        });
        console.log('/hiveGet?appId=' + hive.appId + '&instanceId=' + hive.instanceId + '&secretKey=' + hive.secretKey + '&relativeUrl=/v1' + hive.relativeUrl);
    };
  /*  hive.requests = {
      "GET" : {
        "/contacts" : {
          "contactId" : {
            "type" : "path",
            "message" : "Not mandatory"
          }
        },
        "/contacts/search" : {
            "q" : {
              "type" : "path"
            }
        },
        "/contacts/mailingList" : null,
        "/contacts/{contactId}/activities" : {
          "contactId" : {
            "type" : "path"
          }
        },
        "/activities/{activityId}" : {
          "activityId" : {
            "type" : "path",
            "message" : "Not mandatory"
          }
        },
        "/activities/types" : null,
        "/labels" : {
          "labelId" : {
            "type" : "path",
            "message" : "Not mandatory"
          }
        },
        "/labels/{labelId}/contacts" : {

        },
        "/sites/site" : {

        },
        "/sites/site/contributors" : {

        },
        "/sites/site/pages" : {

        },
        "/sites/site/settings" : {

        },
        "/services/actions/email/providers" : {

        },
        "/billing/products" : {

        },
        "/billing/active" : {

        },
        "/billing/products/{productId}" : {

        },
        "/redirects" : {

        }
      },
      "POST" : {

      },
      "PUT" : {

      }
    }*/








});
