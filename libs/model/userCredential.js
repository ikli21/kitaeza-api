var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Image = new Schema({
//     kind: {
//         type: String,
//         enum: ['thumbnail', 'detail'],
//         required: true
//     },
//     url: { type: String, required: true }
// });

var UserCredential = new Schema({
    
    // productInstance: {type: Schema.ObjectId, ref: 'ProductInstance', required: true},
    user: {type: Schema.ObjectId, ref: 'User', required: true},
    email: {type: String, required: true},
    vkontakte: {type: String, required: false,default:"Не добавлено"},
    telegram: {type: String, required: false,default:"Не добавлено"},
    whatsapp: {type: String, required: false,default:"Не добавлено"},
    viber: {type: String, required: false,default:"Не добавлено"},
    name:{type:String,default:"Не добавлено"},
    surname:{type:String,default:"Не добавлено"},
    
    // order: {type: Schema.ObjectId, ref: 'Order', required: true},
    // basket: {type: Schema.ObjectId, ref: 'Basket', required: true},
    // amount:{type:Int32Array,required:true,default:0},
    modified: { type: Date, default: Date.now }
});

// Product.path('title').validate(function (v) {
//     return v.length > 5 && v.length < 70;
// });

module.exports = mongoose.model('UserCredential', UserCredential);