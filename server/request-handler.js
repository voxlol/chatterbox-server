/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messages = [{name:'Colin', message:'I love chatterbox', room: 'Default'}];

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
    headers['Content-Type'] = "text/plain";

    if(request.url === '/classes/room1' || request.url === '/classes/messages'){
      var body = "";

      request.on('data', function(data){ body += data});
      request.on('end', function(){
        var parsed = JSON.parse(body);

        if(!parsed.username || !parsed.message){
          // If no username or text supplied
          statusCode = 500;
          response.writeHead(statusCode, headers)
          response.end('Invalid data type');
        }else{
          // If data is okay
          messages.unshift(parsed)
          response.end('Message received!');
        }
      })
    }
  } else{
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

