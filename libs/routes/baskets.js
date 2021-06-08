var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Basket = require(libs + 'model/basket');
const Order = require(libs+"model/order");
const Product = require(libs+"model/product");
const ProductInstance = require(libs+"model/productInstance");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = mongoose.model('User');
var controllers = process.cwd() + '/controllers/';
var basket_controller = require(controllers+'basketController');

// List all baskets
router.get('/',  basket_controller.baskets_list_get);
// List all baskets by user
router.get('/basketsbyuser/:userId',  basket_controller.baskets_user_get);

// Create basket
router.post('/', auth.required, basket_controller.basket_create_post);

router.post('/basketToOrderEmailNotify', auth.required, basket_controller.basket_to_order_create_post);

// Get basket
router.get('/:id', basket_controller.basket_id_get);

// Update basket
router.put('/:id', auth.required, basket_controller.basket_id_put);

router.get('/getProductsFromInstancesOfBasket/:basketId', basket_controller.baskets_from_instances_product)

module.exports = router;
