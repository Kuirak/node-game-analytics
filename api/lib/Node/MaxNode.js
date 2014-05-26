'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(MaxNode,Node);
function MaxNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'}],outputs:[{name:'max',type:'number'}]});
    this.transform = new MaxTransform();
    this.transform.pipe(this.demux);
}

util.inherits(MaxTransform,stream.Transform);
function MaxTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.max =0; //get count form Cache

}

MaxTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        var value = chunk.value;
        if (value.data > this.max){
            this.max = value.data;
            value.name ='max';
            //write to cache
            this.push([value]);
        }
    }
    next();
};
module.exports =MaxNode;