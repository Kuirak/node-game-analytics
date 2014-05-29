'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util')
    ,Q=require('q');

util.inherits(Input,stream.Writable);
function Input(id,eventType){
    var self = this;
    self.id=id;
    self.eventType =eventType;
    stream.Writable.call(self,{objectMode:true});
    self.outputs={};
}


Input.prototype.init = function(){
    var deferred = Q.defer();
    var self= this;
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

Input.prototype._write = function(chunk,enc,next){
    if(!chunk){next();return;}
    var self =this;

    //Splitting up the params
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