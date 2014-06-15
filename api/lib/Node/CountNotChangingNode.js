'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,stream = require('stream')
    ,util = require('util');

util.inherits(CountNotChangingNode,Node);
function CountNotChangingNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'},{name:'threshold',type:'number'}],
        outputs:[{name:'count',type:'number'}],
        transform : new CountNotChangingTransform()
    });
}

util.inherits(CountNotChangingTransform,stream.Transform);
function CountNotChangingTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.count =1; //get count form Cache
    this.previous=0;
    this.first =true;
}

CountNotChangingTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        chunk.value.data = parseInt(chunk.value.data);
        //beim ersten Paket wird muss der previous wert gesetzt werden
        if(this.first){
            this.previous =chunk.value.data;
            this.first =false;
            next();
            return;
        }
        var value =chunk.value;
        //Überprüft ob der neue wert im Bereich previous  bis previous + threshold liegt
        if(this.previous <= value.data && this.previous+chunk.threshold.data >= value.data){
            this.count +=1;
            next();
        }else{
            this.previous =value.data;
            //Output setzen
            value.name ='count';
            value.data =this.count;
            //Count zurücksetzen
            this.count=1;
            this.push([value]);
            next();
        }
        //write to cache
    }else{
        next()
    }


};

module.exports =CountNotChangingNode;