const http = require('http');
const request = require('request');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const server = http.createServer(function (req, res){
    if (req.url === "/OAuthTest.html"){
        serveAuthHTML(req, res);
    }
    else if (req.url === "/Authenticate.js?"){
        redirecting(req, res);
    }
    else{
        serveDefaultHTML(req, res);
    }
}).listen(8080);

function serveAuthHTML(req, res){
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

function serveDefaultHTML(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Welcome to my server!")
    res.end("Request url: " + req.url);
}

function redirecting(req, res){
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write("Redirecting");
    console.log("Redirecting");
    res.writeHead(301,
        {Location: 'http://www.google.com'}
    );
    res.end();
}