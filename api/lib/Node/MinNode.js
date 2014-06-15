'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(MinNode,Node);
function MinNode(id){
    Node.call(this,id,{
        inputs:[{name:'value',type:'number'}],
        outputs:[{name:'min',type:'number'}],
        transform: new MinTransform()
    });

}

util.inherits(MinTransform,stream.Transform);
function MinTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.min = Number.MAX_VALUE;
}
//funktioniert umgekehrt wie der MaxNode/transform
MinTransform.prototype._transform = function(chunk,enc,next){
    if(chunk) {
        var value = chunk.value;
        if (value.data < this.min) {
            this.min = value.data;
            value.name ='min';

            this.push([value]);
        }
    }
    next();
};

module.exports = MinNode;