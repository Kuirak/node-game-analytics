'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
 ,stream = require('stream')
    ,util = require('util');

util.inherits(CountNode,Node);
function CountNode(id){
    Node.call(this,id,{
        inputs:[{name:'value',type:'number'}],
        outputs:[{name:'count',type:'number'}],
        transform: new CountTransform()
    });
}
util.inherits(CountTransform,stream.Transform);
function CountTransform(){

    stream.Transform.call(this,{objectMode:true});
    this.count =0;
}

CountTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        var value =chunk.value;
        this.count +=1;
        //Output setzen
        value.name ='count';
        value.data =this.count;
        this.push([value]);
    }

    next();
};

module.exports =CountNode;