var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var mainRPiSchema= mongoose.Schema({
    mainRPiID:{type:String, default:''}, /* se asigna cuando se crea el documento, es entregado por el monitor */
    name:String, /*nombre del monitor, se asigna por el usuario para identificar el cultivo monitoreado */
    userID: {type:String, default:""}, /*Representa el usuario al que pertenece este monitor*/
    status: {type:Boolean,default:false}, /*true si el monitor tiene una conexión abierta con el servidor, false de lo contrario*/
    lastConnection: {type:Number,default:Date.now()}
});

module.exports=mongoose.model('MainRPi',mainRPiSchema);
