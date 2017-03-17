var mongoose=require('mongoose');
var errors=require(__dirname+'/../../errors.js');
var Monitor=require('../../models/monitor.js');
var envVariables=require(__dirname+'/../../envVariables.js');
var monitorArrays=require('../../monitorArrays.js');

module.exports=function(monitorSocket,serverSocket){
  monitorSocket.on('disconnect', function(){
    if(monitorSocket.monitorID!=''){
      Monitor.update({monitorID:mongoose.Types.ObjectId(monitorSocket.monitorID)},
      {$set:{status:false, lastConnection:Date.now()}},function(err,res){
        if(err){
          throw err;
        }
        if(res.ok==1 && res.nModified==1){
          if(monitorArrays.monitorIDs.indexOf(monitorSocket.monitorID.toString())!=-1){
            var monitorIndex=monitorArrays.monitorIDs.indexOf(monitorSocket.monitorID.toString());
            monitorArrays.monitors.splice(monitorIndex,1);
            monitorArrays.monitorIDs.splice(monitorIndex,1);
            if(envVariables.serverConnectionStatus){
              serverSocket.emit('monitorDisconnect',{monitorID:monitorSocket.monitorID.toString()},function(err,res){
                if(err){
                  throw err;
                }
              });
            }
          }
        }
      });
    }
  });
};
