var async=require('async');
var constants= require(__dirname+'/../../../constants.js');
var envVariables=require(__dirname+'/../../../envVariables.js');
var errors=require(__dirname+'/../../../errors.js');

module.exports=function(serverSocket,data,fn){
   if(envVariables.serverConnectionStatus){
      serverSocket.emit('monitorIdentification',data,function(err,res){
         if(err){
            throw err;
         }
         fn(null,res);
      });
   }
   else{
      //lost connection of server
      fn(errors.m004);
   }
};