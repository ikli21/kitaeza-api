const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const User = mongoose.model('User');
var controllers = process.cwd() + '/controllers/';
const user_controller = require(controllers+'/userController')

//POST new user route (optional, everyone has access)
router.post('/', auth.optional,user_controller.user_create_post);

//POST login route (optional, everyone has access)
router.post('/login', auth.optional,user_controller.user_login_post);

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, user_controller.user_current_get);

router.post('/createAdmin', auth.optional, user_controller.admin_create_post);

module.exports = router;