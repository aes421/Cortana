const http = require('http');
const request = require('request');
const fs = require('fs');
const express = require('express');

const app = express();
const server = http.createServer(app);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get('/', serveDefaultHTML);
app.get('/OAuthTest.html', serveAuthHTML);
app.post("/Authenticate.js", function(req, res){
	console.log("Here");
	redirecting(req, res);
	});


server.listen(8080, function(){
    console.log("Listening on http://localhost:8080");
});

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
