var express = require('express');
var ejs = require('ejs');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var logger = require("./utils/logger");

// Setup the app using Express
var app = express();

// Setup the web server host and port
const host = process.env.INTERNAL_HOST || 'http://localhost';
const port = process.env.INTERNAL_PORT || 3000;

// Setup the image path
const imgFiles = fs.readdirSync(process.env.IMG_PATH) || './public/img/about/';

// Setup the random quotes of awesomeness
var quotes = process.env.KC_QUOTES.split('","') || 'No quotes found!';
var quoteCount = quotes.length;

var imgCount = imgFiles.length;

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
//app.use(morgan('combined')); 					// log every request to the console
app.use(morgan('combined', {stream: logger.stream})); // Log to console and file
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

// serve an empty page that just loads the browserify bundle
app.get('/', function(req, res) {
  var pageName = "Home";
  var imgSetLength = 3;
  var minImg = 1;
  var maxImg = imgCount;
  var minQuotes = 1;
  var maxQuotes = quoteCount;
  var imgSet = [];

  while (imgSet.length < imgSetLength) {
    var randNum = Math.ceil(Math.random() * (maxImg - minImg) + minImg);
    var found = false;

    for (var i = 0; i < imgSet.length; i++) {
  	   if (imgSet[i] === randNum) {
         found = true;
         break;
       }
    }
    if(!found) {
      imgSet[imgSet.length] = randNum;
    }
  }

  res.render('pages/index', {
    pageName: pageName,
    imgFile1: imgSet[0],
    imgFile2: imgSet[1],
    imgFile3: imgSet[2]
  });
});

app.get('/about', function(req, res) {
  var pageName = "About";
  var minImg = 1;
  var maxImg = imgCount;
  var minQuotes = 1;
  var maxQuotes = quoteCount;

  var imgFile = Math.round(Math.random() * (maxImg - minImg) + minImg);
  var curQuote = quotes[(Math.round(Math.random() * (maxQuotes - minQuotes) + minQuotes)-1)];

  res.render('pages/about', {
    pageName: pageName,
    imgFile: imgFile,
    curQuote: curQuote
  });
});

app.listen(port);

console.log('Listening on port '+port+'. Open up '+host+':'+port+'/ in your browser.');
