var fs=require('fs');
var async= require('async');
var express =require('express');
var app=express();

var http= require('http').Server(app);
var monitorIO=require('socket.io')(http);

var mongoose= require('mongoose');
var configDB= require('./server/config/database.js');
mongoose.connect(configDB.url);

var envVariables=require('./server/envVariables.js');
var constants=require('./server/constants.js');

//MONGOOSE SCHEMAS
var Monitor=require('./server/models/monitor');
var MainRPi=require('./server/models/mainRPi');
//TODO: Add Actuators arrays and schemas

//TODO: ADD SOCKETIO COMMUNICATIONS
//TODO: Add SocketIO communication protocol with the server
//-Pass requests from server to monitors
var serverSocket=require('socket.io-client')(constants.SERVER_URL,{reconnection: true});
require('./server/sockets/serverSockets/addSensor.js')(serverSocket);
require('./server/sockets/serverSockets/connection.js')(serverSocket);
require('./server/sockets/serverSockets/mReading.js')(serverSocket);
require('./server/sockets/serverSockets/disconnect.js')(serverSocket);

//TODO: Add SocketIO communication protocol with the monitors
monitorIO.on('connection', function(monitorSocket){
  monitorSocket.monitorID='';
  require('./server/sockets/monitorSockets/monitorIdentification.js')(monitorSocket,serverSocket);
  require('./server/sockets/monitorSockets/disconnect.js')(monitorSocket,serverSocket);
  require('./server/sockets/monitorSockets/emits/statusCheckRoutine.js');
});

//TODO: Add SocketIO communication protocol with the actuators

//Initialize server
MainRPi.find({},function(err,docs){
  if(err){
    throw err;
  }
  if(docs.length>0){
    constants.MAINRPI_ID=docs[0].mainRPiID;  
  }
  else{
    constants.MAINRPI_ID='';
  }
});

Monitor.update({},{$set:{status:false}},{multi:true},function(err,res){
  if(err){
    throw err;
  }
  if(res.ok==1){
    http.listen(8080,function(){
      console.log('Monitor socketserver running @ port: 8080');
    });
  }
});

