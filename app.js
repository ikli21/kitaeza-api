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
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
const exphbs = require('express-handlebars')

// const panel = require('./routes/panel')

const { mainModule } = require('process')

// var bodyParser = require( 'body-parser' );
var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');

var config = require('./libs/config');
var log = require('./libs/log')(module);
var oauth2 = require('./libs/auth/oauth2');
// var public = require('./public/style.css');
var api = require('./libs/routes/api');
var users = require('./libs/routes/users');
var articles = require('./libs/routes/articles');
var baskets = require('./libs/routes/baskets');
var categories = require('./libs/routes/categories');
var orders = require('./libs/routes/orders');
var products = require('./libs/routes/products');
var productInstances = require('./libs/routes/productInstances');
var register = require('./libs/routes/register');
var productsCharacteristics = require('./libs/routes/productsCharacteristics');
var userCredentials = require('./libs/routes/userCredentials');
var panel = require('./libs/routes/panel');
require('./libs/config/passport');
require('./libs/routes/auth');

var app = express();
var subpath = express();
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
        if_eq: function(a, b, opts) {
            return a == b ? opts.fn(this) : opts.inverse(this)
        }
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
// app.use(express.static(public));
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static('public'))

app.use(panel)

// app.use(function(req, res) {
//     res.status(404).render('404', {
//         title: '404',
//         isLoggedIn: false
//     })
// })
// app.use(bodyParser());
app.use("/v1", subpath);
app.use(express.static('dist'));
swagger.setAppHandler(subpath);
swagger.setApiInfo({
    title: "Kitaeza-API",
    description: "REST-API для маркетплейс приложения",
    termsOfServiceUrl: "",
    contact: "sergej.sergeevbo@mail.ru",
    license: "",
    licenseUrl: ""
});
subpath.get('/', function (req, res) {
    res.sendfile("./dist/index.html");
});
swagger.configureSwaggerPaths('', 'api-docs', '');

var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');

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
app.use('/api/productsCharacteristics',productsCharacteristics);
app.use('/api/userCredentials',userCredentials);
app.use('/api/adminpanel',panel);
// const express = require('express')
// const path = require('path')

// const PORT = process.env.PORT || 3000

// const app = express()



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
