var express = require('express');
var app = express();
var os = require('os');

// Setup the web server host and port
const host = process.env.INTERNAL_HOST || 'http://localhost';
const port = process.env.INTERNAL_PORT || 3000;
const server_hostname = os.hostname() || 'HOSTNAME-NOT-SET';
const server_ostype = os.type();
const server_osplatform = os.platform();
var server_ostotalmem = os.totalmem();
var server_osfreemem = os.freemem();

var ejs = require('ejs');
var path = require('path');

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// serve an empty page that just loads the browserify bundle
app.get('/', function(req, res) {
  var drinks = [
    { name: 'Bloody Mary', drunkness: 3 },
    { name: 'Martini', drunkness: 5 },
    { name: 'Scotch', drunkness: 10 }
  ];
  var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

  res.render('pages/index', {
    drinks: drinks,
    tagline: tagline
  });
});

app.get('/about', function(req, res) {
  res.render('pages/about', {
    server_hostname: server_hostname,
    server_ostype: server_ostype,
    server_osplatform: server_osplatform,
    server_ostotalmem: server_ostotalmem,
    server_osfreemem: server_osfreemem
  });
});

app.listen(port);

console.log('Your hostname is: '+os.hostname());
console.log('Listening on port '+port+'. Open up '+host+':'+port+'/ in your browser.');
