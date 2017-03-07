var RReading=require('../../models/rReading.js');
var emitRReading=require('../serverSockets/emits/emitRReading.js');
var envVariables=require('../../../envVariables.js');
var errors=require('../../../errors.js');

module.exports=function(socket, serverSocket){
  socket.on('rReading',function(data,fn){
    if(envVariables.monitorIDs.indexOf(data.monID)!=-1){
      //If monitor is recognized as a connected monitor
      if(envVariables.serverConnectionStatus){
        //if connection to server is alive send rReading
        emitRReading(serverSocket,data,function(res,err){
          if(err){
            //TODO: Log error in file
            throw err;
          }
          fn(res);
        });
      }
      else{
        //If connection to server is down, keep the reading locally
        rReading= new RReading(data);
        rReading.save(function(err,res){
          if(err){
            throw err;
          }
          fn({serverSaved:false, mainRPiSaved:true});
        });
      }
    }
    else{
      fn(null,errors.m003);
    }
  });
};
