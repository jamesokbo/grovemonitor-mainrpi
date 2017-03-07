var mongoose=require('mongoose');
var timeoutCallback = require('timeout-callback');
var Monitor=require('../../models/monitor.js');
var envVariables=require('../../envVariables.js');
var constants=require('../../constants.js');
var errors=require('../../errors.js');

module.exports=function(socket){
  socket.on('editLBound',function(data,fn){
    Monitor.find({monitorID:data.monitorID},function(err,docs){
      if(err){
        throw err;
      }
      if(docs.length!=0){
        var monitorIndex=envVariables.monitorIDs.indexOf(data.monitorID);
        if(monitorIndex!=-1){
          envVariables.monitors[monitorIndex].emit('editLBound',data,timeoutCallback(constants.MONITOR_TIMEOUT,function(err,res){
            if(err){
              fn(err);
            }
            //success!
            if(res.status){
                var lBoundString=data.sensor+'.lBound';
                var setLBound={};
                setLBound[lBoundString]=Number(data.newLBound);
                Monitor.update({monitorID:data.monitorID},
                {$set:setLBound},function(err,doc){
                  if(err){
                    throw err;
                  }
                  fn(null,res);
                });
            }
          }));
        }
        else{
          //monitor not connected
          fn(errors.m001);
        }
      }
      else{
        //unidentified monitor
        fn(errors.m003);
      }
    });
  });
};
