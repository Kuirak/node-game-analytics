'use strict';
/**
 * Created by Jonas Kugelmann on 17.05.2014.
 */
var stream = require('stream')
    ,util = require('util')
    ,Q=require('q');
var isRunning =false;
var runningSystems =[];
var NodeType={
    input:'input',
    count:'count',
    valueOutput:'valueOutput',
    max:'max',
    min:'min',
    average:'average'
};

//removes strange standard trasnformations of Waterlines stream()
var Transformations ={};
Transformations.none={};
Transformations.none.write =function(model,index,next){
    next(null,model);
};
Transformations.none.end =function(next){
    next(null);
};

module.exports={
  eventCreated: function(event){
      sails.log.verbose("Event created: ",event.type,event.session);
      //Put in to system
      //timestamp sort
      //wait until Event.stream() is Done then start  new Event.stream() until real time

  },
  run: function(){

      if(isRunning){
          return;
      }
      //setup system

      init();
      isRunning =true;
  },nodeSystemCreated: function(nodeSystem){
        runningSystems.push(setupNodeSystem(nodeSystem));
    }

};

function init(){
    Nodesystem.find().then(function(data){
        runningSystems= _.map(data,setupNodeSystem);
        _.each(runningSystems,function(system){
        });
    }).fail(sails.log.error);

}

function setupNodeSystem(system){
    var nodeSystem ={name:system.name,input:{}};
    var nodes= _.map(system.nodes,function(node){
            return Node.create(node);
    });
    nodeSystem.nodes =nodes;
    //filter Input and sort for eventType;
    var promises= _.chain(nodes)
        .select(function(node){return node instanceof Input;})
        .each(function(node){
            if(!nodeSystem.input[node.eventType]){
                nodeSystem.input[node.eventType] =[];
            }
            nodeSystem.input[node.eventType].push(node);
        }).map(function(input){ //init input returns promise
            return input.init();
        }).value();

    //wait for all inits to be done
    Q.all(promises).then(function(){
        _.each(system.connections,function(conn){
            var source = _.find(nodes,{id:conn.source.node_id});
            var target = _.find(nodes,{id:conn.target.node_id});
            var output =source.outputs[conn.source.output];
            target.attachInput(conn.target.input,output);

        });
        _.each(nodes,function(node){
            if(!node.setupInputs)return;
            node.setupInputs();
        });
        _.forIn(nodeSystem.input,function(value,key){
            _.each(value,function(input){
                Event.stream({type:key},Transformations.none).pipe(input);
            });

        })
    });

    return nodeSystem;

    //add a array of connections which removes the connections after establishing them
    //for each input node setup query from last processed event
    //find connections where input is source
    // instantiate targets(transform streams) if not already exists if exists add  as target (mux/demux)
    //for each target find connection source
    // and instantiate target  until type is output node
}


util.inherits(Input,stream.Writable);
function Input(id,eventType){
    var self = this;
    self.id=id;
    self.eventType =eventType;
    stream.Writable.call(self,{objectMode:true});
    self.outputs={};
}


Input.prototype.init = function(){
    var deferred = Q.defer();
    var self= this;
    Type.findOne({name:self.eventType}).then(function(data){
        if(!data){
            throw new Error("Cannot find EventType: "+self.eventType);
        }
        //every output is a passthrough stream
        self.outputs.timestamp = new stream.PassThrough({objectMode:true});
        _.each(data.params,function(output){
            self.outputs[output.name] = new stream.PassThrough({objectMode:true});
        });
        deferred.resolve();
    }).fail(sails.log.error);
    return deferred.promise;
};

Input.prototype._write = function(chunk,enc,next){
    if(!chunk){next();return;}
    var self =this;

    self.outputs.timestamp.write({data:chunk.timestamp,session_id:chunk.session_id,user_id:chunk.user_id,name:'timestamp'});
    _.forIn(chunk.params,function(data,name){
        self.outputs[name].write({name:name,data:data,session_id:chunk.session_id,user_id:chunk.user_id});
    });
    next();
};

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


util.inherits(MaxNode,Node);
function MaxNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'}],outputs:[{name:'max',type:'number'}]});
    this.transform = new MaxTransform();
    this.transform.pipe(this.demux);
}

util.inherits(MaxTransform,stream.Transform);
function MaxTransform(id){
    this.id =id;
    stream.Transform.call(this,{objectMode:true});
    this.max =0; //get count form Cache

}

MaxTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        if (chunk[0].data > this.max){
            this.max = chunk[0].data;
            chunk[0].name ='max';
            //write to cache
            this.push(chunk);
        }
    }
    next();
};

util.inherits(MinNode,Node);
function MinNode(id){
    Node.call(this,id,{inputs:[{name:'value',type:'number'}],outputs:[{name:'min',type:'number'}]});
    this.transform = new MinTransform();
    this.transform.pipe(this.demux);
}

util.inherits(MinTransform,stream.Transform);
function MinTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.min = Number.MAX_VALUE;
}
MinTransform.prototype._transform = function(chunk,enc,next){
    if(chunk) {
        if (chunk[0].data < this.min) {
            this.min = chunk[0].data;
            chunk[0].name ='min';
            //write to cache
            this.push(chunk);
        }
    }
    next();
};


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


Node.create = function(node){
    if(node.data.nodeType === NodeType.count){
        return new CountNode(node.id);
    }else if(node.data.nodeType === NodeType.max){
        return new MaxNode(node.id);
    }else if(node.data.nodeType === NodeType.min){
        return new MinNode(node.id);
    }else if(node.data.nodeType === NodeType.average){
        return new AverageNode(node.id);
    }else if(node.data.nodeType === NodeType.valueOutput){
        return new OutputNode(node.id);
    }else if(node.data.nodeType ===NodeType.input){
        return new Input(node.id,node.data.eventType);
    }

};



Node.prototype.attachInput =function(inputname,readable){
    var self =this;
    if(!_.some(self.inputs,{name:inputname})){
        throw new Error("This input doesn't exist " +name);
    }
    self.sources[inputname]=readable;
};


Node.prototype.setupInputs =function(){
    var data=[];
    var self =this;
    _.forIn(self.sources,function(stream,name){
        stream.on('data',function(chunk){
            stream.pause();
            chunk.name =name; //changes name to input name
            data.push(chunk);
            if(data.length === _.size(self.sources)){
                self.transform.write(data);
                data.length=0;
                _.each(self.sources,function(stream){
                    stream.resume();
                })
            }
        })
    });
};



