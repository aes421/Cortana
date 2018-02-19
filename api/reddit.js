const http = require('http');
const btoa = require('btoa');
const request = require('request');

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

router.get('/callback', function(req, res){
    if (!req.query.code) throw new Error('NoCodeProvided');
    if (req.query.state != RANDOM_STRING) throw new error('Mismatched strings');
    const CODE = req.query.code;

// var postData = {
//       grant_type: GRANT_TYPE,
//       code: CODE,
//       redirect_uri: URI
//   };

//     var options = {
//         method: "POST",
//         hostname: "www.reddit.com",
//         path: "/api/v1/access_token",
//         auth: `${CLIENT_ID}:${CLIENT_SECRET}`
        
//     };

//     console.log("Starting swap for access token");
//     var post = http.request(options, callback);

//     post.on('error', (e) => {
//         console.error(`problem with request: ${e.message}`);
//       });
//     console.log("posting Data");
//     post.write(postData.toString());
//     post.end();
// });

// function callback(req, res){
//     console.log("Req: " + req);
//     console.log("Res: " + res);
//     //const json = JSON.parse(res);
//     //res.redirect(`/?token=${json.access_token}`);
// };

  request('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    form: {
      grant_type: GRANT_TYPE,
      code: CODE,
      redirect_uri: URI
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET
    }
  }, function (error, res, body){
    if (error){
      console.log("Error: " + error);
      return;
    }
    console.log(res);
    console.log(res.access_token);
    console.log(CODE);
    //const json = res.json();
    //res.redirect(`/?token=${json.access_token}`);
  });
});

// router.get('/callback', catchAsync(async (req, res) => {
//     if (!req.query.code) throw new Error('NoCodeProvided');
//     const CODE = req.query.code;
//     const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//     const response = await fetch(`https://reddit.com/api/v1/access_token?grant_type=${GRANT_TYPE}&code=${CODE}&redirect_uri=${URI}`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Basic ${creds}`,
//         },
//       });
//     const json = await response.json();
//     console.log(response.json());
//     res.redirect(`/?token=${json.access_token}`);
//   }));

module.exports = router;