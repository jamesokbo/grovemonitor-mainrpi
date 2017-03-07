var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var monitorSchema= mongoose.Schema({
    monitorID:String, /*ID assigned by the server on first 'identification', kept as a .txt file in the Monitor*/
    mainRPiID:String, /*main RPi's ID to whom this resMonitor belongs to*/
    name:{type:String,default:'New Monitor'}, /*name of the monitor, assigned by the user*/
    status: Boolean, /*true if connected to the main RPi*/
    lastConnection: Number, /*Last connection to the main RPi*/
    sensors:[String], /*Name of the sensors connected to this monitor (the user is the one who says which sensors are connected) */
    //Note: status in sensors can be "ok" if everything is in order, "warning" if the sensor is live but the reading is out of bounds, 
    //"false" if the sensor is down
    aTemp:{
        nameText:{type:String, default:''}, nameIcon:{type:String, default:'fa fa-thermometer-half'},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'°C'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    }, 
    rh:{
        nameText:{type:String, default:'%'}, nameIcon:{type:String, default:'fa fa-tint'}, 
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'%'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    },
    co2:{
        nameText:{type:String, default:'CO2'}, nameIcon:{type:String, default:''},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'ppm'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    },
    lux:{
        nameText:{type:String, default:''}, nameIcon:{type:String, default:'fa fa-lightbulb-o'},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'lux'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    },
    ph:{
        nameText:{type:String, default:'pH'}, nameIcon:{type:String, default:''},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number, cal4:Date, cal7:Date, cal10:Date,
        unit:{type:String, default:''}, 
        calibration:{firstPoint:{value:Number, date:Number}, secondPoint:{value:Number, date:Number}, thirdPoint:{value:Number, date:Number}}
    },
    ec:{
        nameText:{type:String, default:'EC'}, nameIcon:{type:String, default:''},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'mS'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    },
    do:{
        nameText:{type:String, default:'DO'}, nameIcon:{type:String, default:''},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'ppm'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    },
    wTemp:{
        nameText:{type:String, default:''}, nameIcon:{type:String, default:'fa fa-thermometer-half'},
        status: String, lastReading:Number, lastDate:Number, lBound:Number, uBound:Number,
        unit:{type:String, default:'°C'}, 
        calibration:{
            firstPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            secondPoint:{value:Number, date:{type:Number,default:Date.now}}, 
            thirdPoint:{value:Number, date:{type:Number,default:Date.now}}
        }
    },
    //TODO: Still have to chose how to handle the water level
    //usReader: {status: String, lastReading:Number, lastDate:Number}, /*last distance reading*/
    //resLevel: {lastReading:Number, lastDate:Number, lBound:Number, uBound:Number}, /* % of capacity */
});

module.exports=mongoose.model('Monitor',monitorSchema);