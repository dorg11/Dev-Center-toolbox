angular.module('app').controller('hive', function($scope, $http) {

    $scope.hive = {};
    var hive = $scope.hive;
    console.log(hive);
    hive.url = 'https://openapi.wix.com/v1';
    hive.showObject = function() {
        console.log(hive);
    }
    hive.sendHiveGet = function() {
        hive.getUrl = '/hiveGet?appId=' + hive.appId + '&instanceId=' + hive.instanceId + '&secretKey=' + hive.secretKey + '&relativeUrl=/v1' + hive.relativeUrl + (hive.queryParams ? '&queryParams=' + hive.queryParams : '') + '&requestType=' + hive.requestType;
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
