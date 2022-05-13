const mongoose = require('mongoose');
const {Schema,model} = mongoose;

let post = new Schema({
    titulo:String,
    creador:String,
    urlimagen:String,
    introduccion:String,
    categoria:Array,
    enunciado:String,
    color:String,
    colorletra:String,
    calendar:String,
    time:String
});

module.exports = model('posts', post);
