'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(AverageNode,Node);
function AverageNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'}],outputs:[{name:'average',type:'number'}]});
    this.transform = new AverageTransform();
    this.transform.pipe(this.demux);
}

util.inherits(AverageTransform,stream.Transform);
function AverageTransform(id){
    this.id =id;
    stream.Transform.call(this,{objectMode:true});
    this.average = 0;
    //get count form Cache
}

AverageTransform.prototype._transform = function(chunk,enc,next){
    if(chunk) {
        var average= this.average;
        average+=chunk[0].data;
        average =average /2;
        if(average !== this.average){
            this.average =average;
            chunk[0].name ='average';
            chunk[0].data =this.average;
            this.push(chunk)
        }
    }
    next();
};

module.exports = AverageNode;