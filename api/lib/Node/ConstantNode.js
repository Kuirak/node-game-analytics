'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(ConstantNode,Node);
function ConstantNode(id,constant){
    Node.call(this,id,{
        outputs:[{name:'constant',type:'number'}],
        transform: new ConstantStream(constant)
    });
}

util.inherits(ConstantStream,stream.Readable);
function ConstantStream(constant){
    stream.Readable.call(this,{objectMode:true});
    this.constant =constant; //get count form Cache
}

ConstantStream.prototype._read = function(){
    var value ={};
    value.name ='constant';
    value.data =this.constant;
    this.push([value]);
};

module.exports =ConstantNode;