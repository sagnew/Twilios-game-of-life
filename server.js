// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');

// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + 3000);
});

var io = require('socket.io')(listener);

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

app.post('/sms', (req, res) => {

  // Generate a TwiML response
  var twiml = new twilio.TwimlResponse();
  var msgBody = req.body.Body.trim().toLowerCase();

  if (msgBody === 'start') {
    twiml.message("This is an interactive version of Conway's Game of Life. Text a binary matrix of 1's and 0's to add patterns to the board.\n\nFor example, to add a 'Glider', text:\n\n010\n001\n111\n\nFor more info, visit: https://en.wikipedia.org/wiki/Conway's_Game_of_Life");
  } else {
    twiml.message('Thanks for playing! Use promo code "$BASHNY" for 20% off of your SIGNAL ticket :)');
    io.emit('addPattern', msgBody);
  }

  // Set the response type as XML.
  res.header('Content-Type', 'text/xml');

  // Send the TwiML as the response.
  res.send(twiml.toString());

});
