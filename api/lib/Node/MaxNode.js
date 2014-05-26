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
function MaxTransform(id){
    this.id =id;
    stream.Transform.call(this,{objectMode:true});
    this.max =0; //get count form Cache

}

MaxTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        if (chunk[0].data > this.max){
            this.max = chunk[0].data;
            chunk[0].name ='max';
            //write to cache
            this.push(chunk);
        }
    }
    next();
};
module.exports =MaxNode;