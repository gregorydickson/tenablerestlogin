var http = require('http');
var fs = require("fs");


var users = [];
var validTokens = [];
console.log('server running at http://localhost:8080');
fs.readFile('users.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  users = JSON.parse(data);
});


http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  console.log('checking request method');
  if (request.method === 'POST' && request.url === '/login') {

    console.log('URI /login');
    
    request.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
    

      var data = JSON.parse(body);
      console.log('body:'+body);
      console.log('user:' + data.name);
      var user = data.name;
      var password = data.password;

      var userArray = users.users;
      

      var payload = {};
      for(var i = 0; i < userArray.length; i++) {
        if (userArray[i].name === user) {
            
            //check password
            if(userArray[i].password === password){
              payload = {"token":userArray[i].token};
              validTokens.push(userArray[i].token);
            } else {
              console.log("incorrect password");
              payload = {"error":"incorrect password"};
            }
            break;
        } else {
          console.log("user not found");
          payload = {"error":"user not found"};
        }
      }
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');


      response.on('error', function(err) {
        console.error(err);
      });
      
      response.write(JSON.stringify(payload));
      response.end();
      
    });
  } else if(request.method === 'POST' && request.url === '/logout'){
    
    console.log('URI /logout');
    
    request.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
    

      var data = JSON.parse(body);
      
      var token = data.token;

      var payload = {};
      console.log ('valid tokens:'+validTokens);
      for(var i = 0; i < validTokens.length; i++) {
        console.log("current token:"+validTokens[i]);
        if (validTokens[i] === token) {

            console.log("found token");
            validTokens.splice(i,1);
            payload = {"logout":"success"};
            break;
        } else {
          console.log("token not found");
          payload = {"error":"user not logged in"};
        }
      }
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');


      response.on('error', function(err) {
        console.error(err);
      });
      
      response.write(JSON.stringify(payload));
      response.end();
      
    });

  } else if(request.method === 'GET' && request.url === '/test') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    payload = {"status":"server ok"};
    response.write(JSON.stringify(payload));
    response.end();
  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8080);