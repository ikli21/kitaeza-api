var express = require('express');
var passport = require('passport');
const userCredential = require('../model/userCredential');
var router = express.Router();
var controllers = process.cwd() + '/controllers/';
var credentials_controller = require(controllers+'userCredentialController');
var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var UserCredential = require(libs + 'model/userCredential');

// List all baskets
router.get('/',  credentials_controller.credentials_list_get);

// Create basket
router.post('/', auth.required, credentials_controller.credentials_create_post);

// Get basket
router.get('/:id',  credentials_controller.credentials_id_get);

// Update basket
router.put('/:id', auth.required, credentials_controller.credentials_id_put);

module.exports = router;