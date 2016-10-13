var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var url = 'mongodb://127.0.0.1:27017/';
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  url = process.env.OPENSHIFT_MONGODB_DB_URL;
}
mongoose.connect(url);

var db = mongoose.connection;

var schema = new mongoose.Schema({ body: {}, headers: {} });
var webhook = mongoose.model('webhook', schema);

webhook.remove({ }, function (err) {
  if (err) return handleError(err);
  // removed!
});

app.post('/server', function(req, res) {
  console.log(JSON.stringify(req.body));
  var data = new webhook({ body: req.body, headers: req.headers });
  data.save(function (err) {
    if(err) {
      res.send(err);
    }
    else {
      res.send('saved!');
    }
  })
});
app.get('/', function(req,res) {
  res.send('working');
});


app.get('/display', function(req, res) {
  webhook.find({}, function (err, data) {
    res.render('index', {data: data});
  })
})

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
