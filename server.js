// Babel ES6/JSX Compiler
require('babel-register');

var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var express = require('express');
var app = express();
// var passport = require('passport');
// var session = require('express-session');

var swig  = require('swig');

var configDB = require('./config/database');
// require('./config/passport')(passport);

// Socket.io stuff
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// MongoDB stuff
var mongoose = require('mongoose');

mongoose.connect(configDB.url);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Make sure to run `mongod`');
});

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
// app.use(session({
//   secret: 'mySecretKey',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// route logic
app.use(require('./controllers'));

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send({ message: err.message });
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found');
    };
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});