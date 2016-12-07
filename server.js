var express = require('express');
var app = express();
var mongoose = require('mongoose');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');

app.use('/static', express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var url = 'mongodb://127.0.0.1:27017/';
//take advantage of openshift env vars when available:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL;
    mongoose.connect(url);
    var db = mongoose.connection;

    var schema = new mongoose.Schema({
        body: {},
        headers: {}
    });
    var webhook = mongoose.model('webhook', schema);
}

app.get('/hive', function(req, res) {
    res.sendFile(path.join(__dirname + '/hive.html'));
});

app.get('/hiveGet', function(req, res) {
    var request = new hiveReq(req.query);
    request.run(res);
});
var hiveReq = function(query) {
    var timeStamp = new Date();
    var url = 'https://openapi.wix.com';
    var reqQuery = '';
    var signString = '';
    var paramArray = [{
        'version': '1.0.0'
    }];
    var signArray = [];
    var formData = {};
    var options = {};
    var queryParams = null;
    var parsedBody;
    var signature;
    var res = {};
    var parseBody = function() {
        if (query.postBody) {
            parsedBody = JSON.parse(query.postBody);
            parsedBody.forEach(function(elem) {
                formData[elem.key] = elem.value;
                var obj = {};
                obj[elem.key] = elem.value;
                paramArray.push(obj);
            })
        }
    }
    var parseQuery = function() {
        if (query.queryParams) {
            queryParams = JSON.parse(query.queryParams);
            queryParams.forEach(function(elem) {
                reqQuery += '&' + elem.key + '=' + elem.value;
                var obj = {};
                obj[elem.key] = elem.value;
                paramArray.push(obj);
            })
        }
    }
    var fillOptions = function() {
        options = {
            method: query.requestType,
            url: url + query.relativeUrl + '?version=1.0.0' + reqQuery,
            headers: {
                'x-wix-application-id': query.appId,
                'x-wix-instance-id': query.instanceId,
                'x-wix-timestamp': timeStamp,
                'x-wix-signature': signature //signature that my server generated (equal sign is tossed)
            },
        }
        Object.keys(formData).length > 0 ? options.form = formData : null;
    }
    var sign = function() {
        var res;
        timeStamp = timeStamp.toISOString();
        signArray.unshift(query.relativeUrl);
        signArray.unshift(query.requestType);
        paramArray.forEach(function (item) {
          Object.keys(item).map(function(key) {
            signArray.push(item[key]);
          })
        })
        signArray.push(timeStamp);
        signString = signArray.join('\n');
        res = crypto.createHmac('sha256', query.secretKey);
        signature = res.update(signString).digest('base64').replace(/\+/g, '-').replace(/\//g, '_'); //different base64 standards
    }
    var parseParams = function() {
        parseBody();
        parseQuery();
        paramArray.push({
          'x-wix-application-id': query.appId
        });
        paramArray.push({
          'x-wix-instance-id': query.instanceId
        });
        paramArray.sort(function(a,b) {
          return (Object.keys(a)[0] > Object.keys(b)[0] ?  1 : -1)
        });

    }
    this.run = function(res) {
        parseParams();
        sign();
        fillOptions();
        request(options, function(error, response, body) {
            res.send(response.body);
        });
    }
}
app.post('/server', function(req, res) {
    var data = new webhook({
        body: req.body,
        headers: req.headers
    });
    data.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('saved!');
        }
    })
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/change', function(req, res) {
    res.redirect('/instance');
});

app.get('/instance', function(req, res) {
    res.sendFile(path.join(__dirname + '/instance.html'));
});
app.get('/sign', function(req, res) {
    var data = req.query.data;
    var hmac = crypto.createHmac('sha256', req.query.signature);
    res.send(hmac.update(data).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''));
});
app.get('/get', function(req, res) {
    webhook.find({}, function(err, data) {
        res.json(data);
    })
});
app.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
});
//mongodb://admin:ee1CkJGwc7Zh@127.11.121.130:27017/
