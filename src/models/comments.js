const mongoose = require('mongoose');
const {Schema,model} = mongoose;

let comment = new Schema({
    nombre:String,
    mensajeComment:String
})

module.exports = model('comments',comment)