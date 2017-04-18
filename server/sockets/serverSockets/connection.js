var constants= require(__dirname+'/../../constants.js');
var envVariables=require(__dirname+'/../../envVariables.js');
var monitorArrays=require('../../monitorArrays.js');
var Reading=require('../../models/reading.js');
var MainRPi=require('../../models/mainRPi.js');
var emitRReading=require(__dirname+'/emits/emitRReading');
var emitConnectedMonitors=require(__dirname+'/emits/emitConnectedMonitors');

module.exports = function(socket){
  socket.on('connect',function(){
    socket.emit('mainRPiIdentification', {mainRPiID: constants.MAINRPI_ID}, function(err,res){
      if(err){
        console.log(err);
      }
      if(res.status){
        if(res.new){
          var mainRPi= new MainRPi();
          mainRPi.save(function(err,mon){
            if(err){
              throw err;
            }
            MainRPi.update({_id:mon._id},{$set:{mainRPiID:res.mainRPiID}},function(err,response){
              if(err){
                throw err;
              }
              constants.MAINRPI_ID=res.mainRPiID;
              socket.disconnect();
            });
          });
        }
        else{
          envVariables.serverConnectionStatus=true;
          
          for(var i=0; i<monitorArrays.monitors.length;i++){
            var data={
              monitorID:monitorArrays.monitors[i].monitorID.toString(),
              mainRPiID:constants.MAINRPI_ID
            };
            emitConnectedMonitors(socket,data,function(err,res){
              if(err){
                //TODO: Log error in file
              }
              console.log("monitor "+data.monitorID+" has succesfully been identified!");
            });
          }
          //MainRPi passes readings obtained while server connection was down and removes them afterwards
          Reading.find({},function(err,docs){
            if(err){
              throw err;
            }
            for(var i=0; i<docs.length;i++){
              emitRReading(socket,docs[i],function(err,res){
                if(err){
                  //TODO: Log error in file
                }
                if(res.status){
                  Reading.remove({_id:docs[i]._id},function(err,removed){
                    if(err){
                      throw err;
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }); 
};
