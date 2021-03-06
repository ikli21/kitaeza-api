// var express = require('express');
// var path = require('path');
// var bodyParser = require('body-parser');
var passport = require('passport');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');

var config = require('./config');
var log = require('./log')(module);
var oauth2 = require('./auth/oauth2');

var api = require('./routes/api');
var users = require('./routes/users');
var articles = require('./routes/articles');
var baskets = require('./routes/baskets');
var categories = require('./routes/categories');
var orders = require('./routes/orders');
var products = require('./routes/products');
var productInstances = require('./routes/productInstances');
var register = require('./routes/register');
require('./config/passport');
require('./routes/auth');

var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/articles', articles);
app.use('/api/baskets', baskets);
app.use('/api/categories', categories);
app.use('/api/orders', orders);
app.use('/api/products', products);
app.use('/api/productInstances', productInstances);
app.use('/api/register', register);
app.use('/api/oauth/token', oauth2.token);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});

module.exports = app;
