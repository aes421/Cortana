const http = require('http');
const btoa = require('btoa');
const fetch = require('node-fetch');
const { catchAsync } = require('../utils');

const express = require('express');
const app = express();

const CLIENT_ID="IXKX_GNnghWNYA";
const CLIENT_SECRET="xEOulPITcRVJww_kfHCjGqRXYZs";

const TYPE="code";
const RANDOM_STRING="random_string";
const URI= encodeURIComponent('http://localhost:8080/api/reddit/callback');
const DURATION="temporary";
const SCOPE_STRING="identity";
const GRANT_TYPE='authorization_code';

//https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING 

const router = express.Router();

router.get('/login', function(req, res){
    console.log(`Redirecting to: https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${TYPE}&state=${RANDOM_STRING}&redirect_uri=${URI}&duration=${DURATION}&scope=${SCOPE_STRING}`);
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${TYPE}&state=${RANDOM_STRING}&redirect_uri=${URI}&duration=${DURATION}&scope=${SCOPE_STRING}`);
});

// router.get('/callback', function(req, res){
//     if (!req.query.code) throw new Error('NoCodeProvided');
//     if (req.query.state != RANDOM_STRING) throw new error('Mismatched strings');
//     const CODE = req.query.code;
//     //turns to base64
//     const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//     var options = {
//         method: "POST",
//         host: "reddit.com",
//         path: "/api/v1/access_token",
//         headers: {
//             Authorization: `Basic ${creds}`,
//         }
//     };

//     var postData = {
//         "grant_type": GRANT_TYPE,
//         "code": CODE,
//         "redirect_uri": URI
//     };

//     postData = JSON.stringify(postData);

//     console.log("Starting swap for access token");
//     var post = http.request(options, callback);
//     console.log("DATA: " + postData);

//     post.on('error', (e) => {
//         console.error(`problem with request: ${e.message}`);
//       });
//     post.write(postData);
//     post.end();
// });

// function callback(req, res){
//     console.log(res);
//     //const json = JSON.parse(res);
//     //res.redirect(`/?token=${json.access_token}`);
// };

router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const CODE = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://reddit.com/api/v1/access_token?grant_type=${GRANT_TYPE}&code=${CODE}&redirect_uri=${URI}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });
    const json = await response.json();
    res.redirect(`/?token=${json.access_token}`);
  }));

module.exports = router;