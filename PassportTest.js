const express = require('express');
const path = require('path');


const app = express();

// Routes
app.use('/passport/reddit', require('./passport/reddit'));

app.get('/', function(req, res) {
  res.status(200).sendFile(path.join(__dirname, 'Passport.html'));
});



app.listen(8080, function(){
    console.log("Listening on port 8080");
});