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
    var hiveReq = {};
    hiveReq.timeStamp = new Date();
    hiveReq.timeStamp = hiveReq.timeStamp.toISOString();
    hiveReq.url = 'https://openapi.wix.com';
    hiveReq.headers = 'GET\n' + req.query.relativeUrl + '\n1.0.0\n' + req.query.appId + '\n' + req.query.instanceId + '\n' + hiveReq.timeStamp;
    hiveReq.signature = crypto.createHmac('sha256', req.query.secretKey);
    hiveReq.signature = hiveReq.signature.update(hiveReq.headers).digest('base64').replace(/\+/g, '-').replace(/\//g, '_'); //different base64 standards
    hiveReq.options = {
        url: hiveReq.url + req.query.relativeUrl + '?version=1.0.0',
        headers: {
            'x-wix-application-id': req.query.appId,
            'x-wix-instance-id': req.query.instanceId,
            'x-wix-timestamp': hiveReq.timeStamp,
            'x-wix-signature': hiveReq.signature //signature that my server generated (equal sign is tossed)
        }
    }
    request.get(hiveReq.options, function(error, response, body) {
        res.send(response.body);
    });

});

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
