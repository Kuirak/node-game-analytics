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
    self.transform = options.transform || new stream.PassThrough({objectMode:true});
    if(options.outputs){
        self.demux = new Demux(self.outputs);
        self.transform.pipe(self.demux);
        _.each(options.outputs,function(output){
            if(self.outputs[output.name])return;
            self.outputs[output.name] = new stream.PassThrough({objectMode:true});
        });
    }
}

Node.prototype.attachInput =function(inputname,previousNodeOutputStream){
    var self =this;
    if(!_.some(self.inputs,{name:inputname})){
        throw new Error("This input doesn't exist " +name);
    }
    self.sources[inputname]=previousNodeOutputStream;
};



/**
 *
 */
Node.prototype.setupInputs =function(){
    var data={};
    var self =this;
    var constant={};

    function checkIfAllData() {
        if (_.size(data) === _.size(self.sources)) {
            self.transform.write(data);
            data = {};
            _.each(self.sources, function (input) {
                if (input instanceof stream.Readable) {
                    input.resume();
                } else {
                    data = _.clone(constant);

                }
            })
        }
    }

    _.forIn(self.sources,function(input,name){
        if(!(input instanceof stream.Readable)){
            constant[name]={name:name,data:input};
            data = _.assign(data,constant);
            checkIfAllData();
        }else{
        input.on('data',function(chunk){
            input.pause();
            chunk.name =name;
            data[name]=chunk;
            checkIfAllData();
        })
        }
    });
};

module.exports =Node;