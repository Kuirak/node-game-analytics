'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(EqualsNode,Node);
function EqualsNode(id){
    Node.call(this,id,{
        inputs:[{name:'first',type:'number'},{name:'second',type:'number'}],
        outputs:[{name:'true',type:'number'},{name:'false',type:'number'}],
        transform: new EqualsTransform()
    });
}


util.inherits(EqualsTransform,stream.Transform);
function EqualsTransform(){
    stream.Transform.call(this,{objectMode:true});
}

EqualsTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        var value =null;
        //stellt sicher das das AusgangsPaket eine Session_id hat
        if(chunk.first.session_id){
           value= chunk.first;
        }else{
            value =chunk.second;
        }
        //vergleicht die daten
        if(chunk.first.data=== chunk.second.data){
            //Output setzen
            value.name='true';
            this.push([value]);
        }else{
            //Output setzen
            value.name='false';
            this.push([value]);
        }
    }
    next();
};

module.exports =EqualsNode;