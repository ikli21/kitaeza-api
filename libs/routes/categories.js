var express = require('express');
var passport = require('passport');
var router = express.Router();
// Требующиеся модули контроллеров.
var controllers = process.cwd() + '/controllers/';
var category_controller = require(controllers+'/categoryController');
// var author_controller = require('../controllers/authorController');
// var genre_controller = require('../controllers/genreController');
// var book_instance_controller = require('../controllers/bookinstanceController');
var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
const auth = require('./auth');
var db = require(libs + 'db/mongoose');
var Category = require(libs + 'model/category');

// List all baskets
router.get('/', category_controller.category_list
// function (req, res) {

    // Category.find(function (err, category) {
    //     if (!err) {
    //         return res.json(category);
    //     } else {
    //         res.statusCode = 500;

    //         log.error('Internal error(%d): %s', res.statusCode, err.message);

    //         return res.json({
    //             error: 'Server error'
    //         });
    //     }
    // });
// }
);

// Create basket
router.post('/', auth.required, category_controller.category_create_post );
// Get basket
router.get('/:id', category_controller.category_id_get);

// Update basket
router.put('/:id', auth.required, category_controller.category_id_update_put);

module.exports = router;
