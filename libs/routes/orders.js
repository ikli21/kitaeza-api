var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Order = require(libs + 'model/order');
var controllers = process.cwd() + '/controllers/';
var order_controller = require(controllers+'orderController');

// List all baskets
router.get('/', order_controller.orders_list_get);

// List all baskets
router.get('/ordersbyuser/:userId',order_controller.orders_user_get  );

// Create basket
router.post('/', auth.required, order_controller.orders_create_post);

// Get basket
router.get('/:id',  order_controller.order_id_get);

// Update basket
router.put('/:id', auth.required, order_controller.orders_id_put);

module.exports = router;