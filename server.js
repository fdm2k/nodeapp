var express = require('express');
var ejs = require('ejs');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Setup the app using Express
var app = express();

// Setup the web server host and port
const host = process.env.INTERNAL_HOST || 'http://localhost';
const port = process.env.INTERNAL_PORT || 3000;

var quotes = process.env.KC_QUOTES.split('","') || 'No quotes found!';
var quote_count = quotes.length;

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

// serve an empty page that just loads the browserify bundle
app.get('/', function(req, res) {
  var pagename = "Home";

  res.render('pages/index', {
    pagename: pagename
  });
});

app.get('/about', function(req, res) {
  var pagename = "About";
  var min = 1;
  var max = 13;
  var min_quotes = 1;
  var max_quotes = quote_count;

  res.render('pages/about', {
    pagename: pagename,
    min: min,
    max: max,
    quotes: quotes,
    min_quotes: min_quotes,
    max_quotes: max_quotes
  });
});

app.listen(port);

console.log('Listening on port '+port+'. Open up '+host+':'+port+'/ in your browser.');
