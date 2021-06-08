var express = require('express');
var passport = require('passport');
const product = require('../model/product');
const productInstance = require('../model/productInstance');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var ProductInstance = require(libs + 'model/productInstance');
var controllers = process.cwd() + '/controllers/';
var product_instances_controller = require(controllers+'productInstanceController');

// List all baskets
router.get('/', product_instances_controller.instances_list_get);
//List Instances by order id
router.get('/instancesByOrder/:orderId', product_instances_controller.instances_order_get);
//List instances by basketId
router.get('/instancesByBasket/:basketId', product_instances_controller.instances_basket_get);

// router.get('/',async function (req, res) {

//     await ProductInstance.find(function (err, productInstance) {
//         if (!err) {
//             return res.json(productInstance);
//         } else {
//             res.statusCode = 500;

//             log.error('Internal error(%d): %s', res.statusCode, err.message);

//             return res.json({
//                 error: 'Server error'
//             });
//         }
//     });
// });
// Create basket
router.post('/', auth.required,product_instances_controller.instances_create_post);

// Get basket
router.get('/:id', product_instances_controller.instances_id_get);

// Update basket
router.put('/:id', auth.required, product_instances_controller.instances_id_put);

router.delete('/deleteAllInstancesByBasket', auth.required, product_instances_controller.instances_basket_delete);

router.delete('/deleteInstance', auth.required, product_instances_controller.instances_delete_id);


module.exports = router;