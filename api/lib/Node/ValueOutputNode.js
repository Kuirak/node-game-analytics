'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,Q = require('q')
    ,util = require('util');

util.inherits(OutputNode,Node);
/**
 *  Der Outputnode schreibt die Inputs als Event in die Datenbank
 * @param id Id des Nodes im NodeSystem
 * @param outputType Name des output events
 * @constructor
 */
function OutputNode(id,outputType){
    Node.call(this,id,{
        inputs:[{name:'value',type:'number'}],
        transform: new OutputStream(outputType)
    });
    this.outputType =outputType;
    //create event type
}
/**
 * Muss vor start des NodeSystems ausgeführt werden
 * @returns promise
 */
OutputNode.prototype.init =function(){
var deferred = Q.defer();
var type ={
     name:this.outputType,
     params:[{name:'value',type:'number'}],
     internal:true
};
Type.findOne({name:this.outputType}).then(function(data){
     if(data){
         deferred.resolve();
         return;
     }
     return Type.create(type);
}).then(function(data){
     deferred.resolve();
}).fail(sails.log.error);
    deferred.resolve();
return deferred.promise;
};


util.inherits(OutputStream,stream.Writable);
function OutputStream(outputType){
    stream.Writable.call(this,{objectMode:true});
    this.outputType =outputType
}
OutputStream.prototype._write =function(chunk,enc,next){
    var event = _.clone(chunk.value);
    var params ={};
    params[event.name] =event.data;
    event.params =params;
    event.type =this.outputType;
    delete event.name;
    delete event.data;
    //findOrCreate - wird umgewandelt wenn man reprocessing implementiert
    //updated im Moment falls ein Event zu diesem Zeitpunkt schon vorhanden ist
    //Ansonten wird ein neues erstellt und an die verbundenen Clients veröffentlicht
    Event.findOne({type:event.type,session_id:event.session_id,timestamp:event.timestamp}).then(function(data){
        if(data){
            data.params =event.params;
            return Q.ninvoke(data,'save')
        }else{
          return Event.create(event).then(Event.publishCreate);
        }
    }).fail(sails.log.error);
    next();
};
module.exports =OutputNode;