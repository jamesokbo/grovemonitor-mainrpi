var fs=require('fs');
var async=require('async');
var constants= require(__dirname+'/../../constants.js');
var envVariables=require(__dirname+'/../../envVariables.js');
var Reading=require('../../models/reading.js');


module.exports = function(socket){
  socket.on('disconnect',function(){
    console.log('disconnected from server!');
    envVariables.serverConnectionStatus=false;
  });
};
