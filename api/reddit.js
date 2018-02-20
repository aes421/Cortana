const http = require('http');
const btoa = require('btoa');
const request = require('request');

const express = require('express');
const app = express();

const CLIENT_ID = "IXKX_GNnghWNYA";
const CLIENT_SECRET = "xEOulPITcRVJww_kfHCjGqRXYZs";

const TYPE = "code";
const RANDOM_STRING = "random_string";
const URI = 'http://localhost:8080/api/reddit/callback';
const DURATION = "temporary";
const SCOPE_STRING = "identity";
const GRANT_TYPE = 'authorization_code';

//https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING 

const router = express.Router();

router.get('/login', function (req, res) {
  res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${TYPE}&state=${RANDOM_STRING}&redirect_uri=${URI}&duration=${DURATION}&scope=${SCOPE_STRING}`);
});

router.get('/callback', function (req, res) {
  if (!req.query.code) throw new Error('NoCodeProvided');
  if (req.query.state != RANDOM_STRING) throw new error('Mismatched strings');
  const CODE = req.query.code;

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
  }, function (error, response, body) {
    if (error) {
      console.log("Error: " + error);
      return;
    }
    const json = JSON.parse(body);
    request("https://oauth.reddit.com/api/v1/me/trophies", {
      headers: {
        'User-Agent': 'request'
      },
      auth: {
        'bearer': json.access_token
      }
    }, function (error, response, body) {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      res.redirect(`http://localhost:8080/api/reddit/user?trophies=${JSON.parse(body).data.trophies.length}`);
    });
  });
});

router.get('/user', function (req, res) {
  //TODO this should be a cookie
  res.send(`You have ${req.query.trophies} trophies!!`);
});

module.exports = router;