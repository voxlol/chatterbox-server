var http = require("http");
var express = require("express");
var fs = require('fs');
var handleRequest =  require('./request-handler.js').requestHandler
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
var messages = [];
var port = 3000;

fs.readFile(__dirname + '/messages.txt', function(err,logData){
  if(err){return console.log('file not found where is?' + err)}
  messages = logData.toString().split('\n')
    .filter(function(msg){return msg !== ""})
    .map(function(msg){return JSON.parse(msg);})
});

app.use(bodyParser.json()); // for parsing application/json
app.use(multer()); // for parsing multipart/form-data
app.use(function(req, res, next) {
  res.header({
    "Access-Control-Allow-Origin" : "*",
    "Access-control-allow-methods" : "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
    "access-control-max-age" : 10,
    "Content-Type" : "application/json"
  })
  next();
});
app.use("/", express.static((path.join(__dirname, '../client/'))))
app.get('/', function (req, res) {res.render((path.join(__dirname, '../client/index.html')))});
app.get('/classes/room1', function (req, res) {
  var data = { results : messages };
  res.send(data);
})
app.post('/classes/room1', function (req, res) {
  messages.unshift(req.body);

  fs.appendFile(__dirname + '/messages.txt', '\n'+JSON.stringify(req.body), function(err){
    err ? console.log('append error' + err) : console.log('append success');
  });
  res.sendStatus(201);
  res.send({success:true});
})

var server = app.listen(port, function(){ console.log("We have started our server on port " + port)});
