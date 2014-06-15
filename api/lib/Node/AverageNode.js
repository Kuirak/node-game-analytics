'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(AverageNode,Node);
function AverageNode(id){
    Node.call(this,id,{
        inputs:[{name:'value',type:'number'}],
        outputs:[{name:'average',type:'number'}],
        transform: new AverageTransform()
    });
}

util.inherits(AverageTransform,stream.Transform);
function AverageTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.average = 0;
    //get count form Cache
}

AverageTransform.prototype._transform = function(chunk,enc,next){
    if(chunk) {
        var value =chunk.value;
        var average= this.average;
        average+=value.data;
        //Berechnung des neuen Durchschnitts
        average =average /2;
        if(average !== this.average){
            this.average =average;
            //Output setzen
            value.name ='average';
            value.data =this.average;
            this.push([value])
        }
    }
    next();
};

module.exports = AverageNode;