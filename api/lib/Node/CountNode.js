'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
 ,stream = require('stream')
    ,util = require('util');

util.inherits(CountNode,Node);
function CountNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'}],outputs:[{name:'count',type:'number'}]});
    this.transform = new CountTransform();
    this.transform.pipe(this.demux);
}
util.inherits(CountTransform,stream.Transform);
function CountTransform(id){
    this.id =id;
    stream.Transform.call(this,{objectMode:true});
    this.count =0; //get count form Cache
}

CountTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        this.count +=1;
        chunk[0].name ='count';
        chunk[0].data =this.count;
        //write to cache
        this.push(chunk);
    }

    next();
};

module.exports =CountNode;