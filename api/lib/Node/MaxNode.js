'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(MaxNode,Node);
function MaxNode(id){
    Node.call(this,id,{
        inputs:[{name:'value',type:'number'}],
        outputs:[{name:'max',type:'number'}],
        transform: new MaxTransform()
    });
}

util.inherits(MaxTransform,stream.Transform);
function MaxTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.max =0;

}

MaxTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        var value = chunk.value;
        //überprüft ob der neue wert größer als das alte max ist
        //schreibt nur ein neues Paket wenn die der Fall
        //hier könnte man einen Reset implementieren um einen verlauf
        //der Werte in gewissen zeitfenstern zu bekommen

        if (value.data > this.max){
            this.max = value.data;
            value.name ='max';
            this.push([value]);
        }
    }
    next();
};
module.exports =MaxNode;