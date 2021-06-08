var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var ProductCharacteristics = require(libs + 'model/productCharacteristics');
var controllers = process.cwd() + '/controllers/';
var product_characteristics_controller = require(controllers+'productCharacteristicsController');
// List all baskets
router.get('/',  product_characteristics_controller.characteristics_list_get);

// List all baskets
router.get('/productCharacteristicsbyproduct/:productId',  product_characteristics_controller.characteristics_product_id_get);

// Create basket
router.post('/', auth.required, product_characteristics_controller.characteristics_create_post);

// Get basket
router.get('/:id', auth.required, product_characteristics_controller.characteristics_id_get);

// Update basket
router.put('/:id', auth.required, product_characteristics_controller.characteristics_id_put);

module.exports = router;