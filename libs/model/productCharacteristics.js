const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { model } = require('./product');

const  Schema  = mongoose.Schema;

const productCharacteristics = new Schema({
  characName: String,
  description: String,
  product: {type: Schema.ObjectId, ref: 'Product', required: true},
});

module.exports = mongoose.model('ProductCharacteristics', productCharacteristics);