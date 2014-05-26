'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(OutputNode,Node);
function OutputNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'}]});
    this.transform = new ConsoleStream();
}

util.inherits(ConsoleStream,stream.Writable);
function ConsoleStream(id){
    this.id =id;
    stream.Writable.call(this,{objectMode:true});
}
ConsoleStream.prototype._write =function(chunk,enc,next){
    sails.log.info(chunk);
    next();
};
module.exports =OutputNode;