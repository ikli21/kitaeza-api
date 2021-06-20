const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const  Schema  = mongoose.Schema;

const User = new Schema({
  email: String,
  hash: String,
  role: {type: String, required: true, enum: ['Пользователь', 'Админ'], default: 'Пользователь'},
  salt: String,
});

User.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

User.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

User.methods.generateJWT = function(
  // basketId
  ) {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({

    email: this.email,
    id: this._id,
    // basket:basketId,
    role: this.role,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

User.methods.toAuthJSON = function(
  // basketId
  ) {
  return {
    _id: this._id,
    email: this.email,
    // basket:basketId,
    token: this.generateJWT(),
  };
};

mongoose.model('User', User);
