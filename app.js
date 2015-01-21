var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//Enable CORS -- What is that?
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var data = fs.readFileSync('config_local.json'),
    parameters;

try {
    parameters = JSON.parse(data);
}
catch (err) {
    console.log('There has been an error parsing config file.')
    console.log(err);
}

//Connect to mongo DB
mongoose.connect('mongodb://localhost:' + parameters.db_port + '/' + parameters.db_name);
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connection to database " + parameters.db_name + " established");
});


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var api = require('./routes/api');
var user_controller = require('./routes/users_controller');
var page_controller = require('./routes/page_controller');
var routes = require('./routes/index');

app.use('/api', api);
app.use('/page', page_controller);
app.use('/users', user_controller);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
app.listen(3000);