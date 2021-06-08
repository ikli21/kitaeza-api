var express = require('express');
var passport = require('passport');
const product = require('../model/product');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Product = require(libs + 'model/product');
var Category = require(libs+'model/category');
var controllers = process.cwd() + '/controllers/';
var product_controller = require(controllers+'productController');
// List all baskets
router.get('/',  product_controller.products_list_get);

router.get('/listTenProducts',  product_controller.products_list_ten_get);

// Create basket
router.post('/', auth.required, product_controller.products_create_post);

// Get basket
router.get('/:id', product_controller.products_id_get);
router.get('/productCategory/:categoryId', product_controller.products_list_category_get);
// Update basket
router.put('/:id', auth.required, product_controller.products_id_put);

module.exports = router;