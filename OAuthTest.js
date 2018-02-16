const http = require('http');
const request = require('request');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

http.createServer(function (req, res){
    if (req.url === "/OAuthTest.html"){
        fs.readFile("OAuthTest.html", function(err, data){
            if (err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(err);
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("Welcome to my server!")
        res.end("Request url: " + req.url);
    }
}).listen(8080);