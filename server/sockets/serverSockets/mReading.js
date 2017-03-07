var constants= require(__dirname+'/../../constants.js');
var errors= require(__dirname+'/../../errors.js');
var envVariables=require(__dirname+'/../../envVariables.js');
var Monitor=require('../../models/monitor.js');


module.exports = function(socket){
  socket.on('mReading',function(data,fn){
    if(envVariables.monitorIDs.indexOf(data.monitorID)!=-1){
      envVariables.monitors[envVariables.monitorIDs.indexOf(data.monitorID)].emit('mReading',data,function(err,res){
        if(err){
          throw err;
        }
        fn(null,res);
      });
    }
    else{
      Monitor.find({monitorID:data.monitorID},function(err,docs){
        if(err){
          throw err;
        }
        if(docs.length!=0){
          fn(errors.m001);
        }
        else{
          fn(errors.m002);
        }
      });
    }
  });
};
