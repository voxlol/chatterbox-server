
/* Import node's http module: */
var http = require("http");
var express = require("express");
var fs = require('fs');
var _ = require('underscore');
var handleRequest =  require('./request-handler.js').requestHandler
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
var messages = [];
var port = 3000;

fs.readFile(__dirname + '/messages.txt', function(err,logData){
  if(err){
    console.log(err);
    console.log('file not found where is?');
    return;
  }
  messages = logData.toString().split('\n');
  messages = messages.filter(function(msg){
    if (msg !== "") {
      return true;
    }else{
      return false;
    }
  })
  messages = messages.map(function(msg){
    return JSON.parse(msg);
  })
});

app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("access-control-max-age", 10) // Seconds.
  res.header("Content-Type", "application/json");
  next();
});

app.use("/", express.static((path.join(__dirname, '../client/'))))
app.get('/', function (req, res) {
  res.render((path.join(__dirname, '../client/index.html')))});
app.get('/classes/room1', function (req, res) {
  var data = {
    sucesss: true,
    results : messages
  }
  // edit status code to 201;
  res.send(data);
})
app.post('/classes/room1', function (req, res) {
  // data is in req.body
  messages.unshift(req.body);

  fs.appendFile(__dirname + '/messages.txt', '\n'+JSON.stringify(req.body), function(err){
    if(err) {
      console.log('append error' + err)
    }else{
      console.log('append success')
    }
  });
  res.sendStatus(201);
  res.send({sucess:true});
})

var server = app.listen(port,function(){
  console.log("We have started our server on port 3000");
});

// var apiserver = api.listen(3001,function(){
//   console.log("We have started our server on port 3001");
// });
// var server = http.createServer(handleRequest);
// console.log("Listening on http://" + ip + ":" + port);
// server.listen(port, ip);
