var mongoose=require('mongoose');
var timeoutCallback = require('timeout-callback');
var Monitor=require('../../models/monitor.js');
var envVariables=require('../../envVariables.js');
var constants=require('../../constants.js');
var errors=require('../../errors.js');
var monitorArrays=require('../../monitorArrays.js');

module.exports=function(socket){
  socket.on('addSensor',function(data,fn){
    console.log("adding sensor");
    Monitor.find({monitorID:data.monitorID},function(err,docs){
      if(err){
        throw err;
      }
      if(docs.length!=0){
        var monitorIndex=monitorArrays.monitorIDs.indexOf(data.monitorID);
        if(monitorIndex!=-1){
          monitorArrays.monitors[monitorIndex].emit('addSensor',data,timeoutCallback(constants.MONITOR_TIMEOUT,function(err,res){
            if(err){
              fn(err);
            }
            else{
              //success!
              if(res.status){
                var sensors=docs[0].sensors;
                sensors.push(data.newSensor);
                sensors.sort();
                Monitor.update({monitorID:data.monitorID},
                {$set:{'sensors':sensors}},function(err,doc){
                  if(err){
                    throw err;
                  }
                  fn(null,res);
                });
              }
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