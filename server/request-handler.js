/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var express = require("express");
var app = express();
var fs = require('fs');
var _ = require('underscore');

var messages = [];

fs.readFile(__dirname + '/messages.txt', function(err,logData){
  if(err){
    console.log(err);
    console.log('file not found where is?');
    return;
  }
  debugger;

  messages = logData.toString().split('\n');
  messages = messages.filter(function(msg){
    debugger;
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

exports.requestHandler = function(request, response) {
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  // console.log("Serving request type " + request.method + " for url " + request.url);

  if(request.method === 'GET'){
    // General get request handler
    if(request.url !== '/classes/room1' && request.url !== '/classes/messages'){
      statusCode = 404;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      response.end('Not found');
    }else{
      headers['Content-Type'] = "application/json";
      statusCode = 200;
      response.writeHead(statusCode, headers)
      var data = {
        results: messages
      };
      response.end(JSON.stringify(data));
    }

  }else if(request.method === 'POST'){
    // General POST request handler
    statusCode = 201;
    response.writeHead(statusCode, headers)
    headers['Content-Type'] = "application/json";

    if(request.url === '/classes/room1' || request.url === '/classes/messages'){
      var body = "";

      request.on('data', function(data){ body += data});
      request.on('end', function(){
        var parsed = JSON.parse(body);

        if(!parsed.username || !parsed.message){
          // If no username or text supplied
          statusCode = 500;
          response.writeHead(statusCode, headers)
          response.end(JSON.stringify({success:false}));
        }else{
          // If data is okay
          messages.unshift(parsed)
          // write it othe file?
          fs.appendFile(__dirname + '/messages.txt', '\n'+JSON.stringify(parsed), function(err){
            if(err) {
              console.log('append error' + err)
            }else{
              console.log('append success')
            }
          });
          response.end(JSON.stringify({success:true}));
        }
      })
    }
  }else if(request.method === 'OPTIONS'){
    statusCode = 200;
    response.writeHead(statusCode, headers)

    // response.end("Allow: GET, POST, PUT, DELETE, OPTIONS");
    response.end();
  }else{
    // 404 Request handler
    statusCode = 404;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    response.end('Not found');
  }

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

