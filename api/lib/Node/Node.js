'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var stream = require('stream')
    ,util = require('util');

util.inherits(Demux,stream.Writable);
function Demux(outputs){
    stream.Writable.call(this,{objectMode:true});
    this.outputs=outputs;
}

Demux.prototype._write =function(chunk,enc,next){
    _.each(chunk,function(output){
        this.outputs[output.name].write(output);
    },this);
    next();
};


//Node Factory
function Node(id,options){
    var self =this;
    self.id =id;
    options = options ||{inputs:[{name:'value',type:'number'}],outputs:[{name:'value',type:'number'}]};
    self.outputs ={};
    self.inputs =options.inputs;
    self.sources ={};
    _.each(options.outputs,function(output){
        //use
        self.outputs[output.name] = new stream.PassThrough({objectMode:true});
    });
    self.demux = new Demux(self.outputs);

}

Node.prototype.attachInput =function(inputname,readable){
    var self =this;
    if(!_.some(self.inputs,{name:inputname})){
        throw new Error("This input doesn't exist " +name);
    }
    self.sources[inputname]=readable;
};

/**
 *
 */
Node.prototype.setupInputs =function(){
    var data={};
    var self =this;
    _.forIn(self.sources,function(stream,name){
        stream.on('data',function(chunk){
            stream.pause();
            chunk.name =name; //changes name to input name
            data[name]=chunk;
            if(_.size(data) === _.size(self.sources)){
                self.transform.write(data);
                data={};
                _.each(self.sources,function(stream){
                    stream.resume();
                })
            }
        })
    });
};

module.exports =Node;