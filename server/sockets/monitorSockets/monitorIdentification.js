var mongoose=require('mongoose');
var Monitor=require('../../models/monitor.js');
var errors=require('../../errors.js');
var envVariables=require(__dirname+'/../../envVariables.js');
var monitorArrays=require('../../monitorArrays.js');

module.exports=function(monitorSocket,serverSocket){
    monitorSocket.on('monitorIdentification',function(data, fn){
        if(data.monitorID!='' && data.monitorID!=null){
            monitorSocket.monitorID=mongoose.Types.ObjectId(data.monitorID);
        
            if(monitorArrays.monitorIDs.indexOf(monitorSocket.monitorID.toString())!=-1){
              monitorArrays.monitors[monitorArrays.monitorIDs.indexOf(monitorSocket.monitorID.toString())].disconnect();
              monitorArrays.monitors.splice(monitorArrays.monitorIDs.indexOf(monitorSocket.monitorID.toString()),1);
              monitorArrays.monitorIDs.splice(monitorArrays.monitorIDs.indexOf(monitorSocket.monitorID.toString()),1);
            }
        
            Monitor.find({monitorID:monitorSocket.monitorID},function(err,docs){
              if(err){
                throw err;
              }
              if(docs.length!=0){
                Monitor.update({monitorID:monitorSocket.monitorID},{$set:{status:true, lastConnection:Date.now()}},function(err,res){
                  if(err){
                    throw err;
                  }
                  if(res.ok==1 && res.nModified==1){
                    monitorArrays.monitorIDs.push(monitorSocket.monitorID.toString());
                    monitorArrays.monitors.push(monitorSocket);
                    console.log('monitor '+ monitorSocket.monitorID+' has succesfully been identified');
                    console.log('monitorIDs length: '+ monitorArrays.monitorIDs.length+',monitors length: '+monitorArrays.monitors.length);
                    if(envVariables.serverConnectionStatus){
                        serverSocket.emit('monitorIdentification',data,function(err,res){
                            if(err){
                                fn(err);
                            }
                            console.log('succesfully identified by server as well!');
                            fn(null,res);
                        });   
                    }
                    else{
                        fn(null,{status:true});
                    }
                  }
                });
              }
              //Not found in our database 
              else{
                console.log(errors.m003);
                fn(errors.m003);
                monitorSocket.disconnect();
              }
            });
        }
      //Si el ID está vacío, es un monitor nuevo y se le debe asignar ID nuevo
      else{
        if(envVariables.serverConnectionStatus){
            serverSocket.emit('monitorIdentification',data,function(err,res){
                if(err){
                    fn(err);
                }
                var monitor=new Monitor();
                monitor.save(function(err,mon){
                  if(err){
                    throw err;
                  }
                  Monitor.update({_id:mon._id},{$set:{monitorID:res.monitorID}},function(err,response){
                    if(err){
                      throw err;
                    }
                    fn(null,res);
                  });
                });
            });   
        }
        else{
            console.log(errors.m006);
            fn(errors.m006);
        }
      }
  });
};