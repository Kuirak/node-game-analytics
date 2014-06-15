'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util')
    ,Q=require('q');

util.inherits(Input,stream.Writable);
/**
 * Der InputNode ist eine eigene Implementierung und hängt nicht mit Node zusammen da einige Spezialfälle abgehandelt werden müssen
 * @param id Id des Nodes im NodeSystem
 * @param eventType Typ des Events das der Input zurverfügung stellt
 * @constructor
 */
function Input(id,eventType){
    var self = this;
    self.id=id;
    self.eventType =eventType;
    stream.Writable.call(self,{objectMode:true});
    self.outputs={};
}

/**
 * muss aufgerufen werden bevor Daten in den Inputgestreamt werden.
 * @returns promise
 */
Input.prototype.init = function(){
    var deferred = Q.defer();
    var self= this;
    //Erstellt für jedes Parameter einen PasstrhoughStream
    Type.findOne({name:self.eventType}).then(function(data){
        if(!data){
            throw new Error("Cannot find EventType: "+self.eventType);
        }
        //every output is a passthrough stream
        self.outputs.timestamp = new stream.PassThrough({objectMode:true});
        _.each(data.params,function(output){
            self.outputs[output.name] = new stream.PassThrough({objectMode:true});
        });
        deferred.resolve();
    }).fail(sails.log.error);
    return deferred.promise;
};

// Implementierung des WritableStreams
Input.prototype._write = function(chunk,enc,next){
    if(!chunk){next();return;}
    var self =this;

    //Verteilung der Parameter auf die Outputs - funktioniert ähnlich wie der Demux
    self.outputs.timestamp.write(
        {data:chunk.timestamp,
        session_id:chunk.session_id,
        user_id:chunk.user_id,
        name:'timestamp',
        timestamp:chunk.timestamp
    });

    _.forIn(chunk.params,function(data,name){
        self.outputs[name].write({
            name:name,
            data:data,
            session_id:chunk.session_id,
            user_id:chunk.user_id,
            timestamp:chunk.timestamp
        });
    });
    next();
};
module.exports = Input;