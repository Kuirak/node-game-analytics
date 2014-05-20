'use strict';
/**
 * Created by Jonas Kugelmann on 17.05.2014.
 */
var stream = require('stream');
var util = require('util');
var isRunning =false;
var runningSystems =[];
var NodeType={
    input:'input',
    count:'count',
    valueOutput:'calueOutput',
    max:'max',
    min:'min',
    average:'average'
};
module.exports={
  eventCreated: function(event){
      sails.log.verbose("Event created: ",event.type,event.session);
      //Put in to system

  },
  run: function(){

      if(isRunning){
          return;
      }
      isRunning =true;
      //setup system
        init();
  },nodeSystemCreated: function(nodeSystem){

    }

};

function init(){

    Nodesystem.find().then(function(data){
        _.each(data,setupNodeSystem);
    }).fail(sails.log.error);



}
function setupNodeSystem(system){
    var nodes = system.nodes;
    var inputNodes = _.select(nodes,function(node){
        return node.data ? (node.data.nodeType ===NodeType.input) :false;
    });
    var runningSystem={input:[]};
    _.each(inputNodes,function(input){
        var eventInput = new Input(input.data.eventType);
        runningSystem.input.push(eventInput);
       var conns = _.select(system.connections,function(conn){
           return conn.source.node_id === input.id;
       });
       var targets = _.select(nodes,function(node){
           return _.find(conns,{target:{node_id:node.id}})!== undefined;
       });
       _.each(targets,function(target){
            if(target.data.nodeType === NodeType.count){

            }else if(target.data.nodeType === NodeType.max){

            }else if(target.data.nodeType === NodeType.min){

            }else if(target.data.nodeType === NodeType.average){

            }else if(target.data.nodeType === NodeType.valueOutput){

            }
        });

    });
    //add a array of connections which removes the connections after establishing them
    //for each input node setup query from last processed event
    //find connections where input is source
    // instantiate targets(transform streams) if not already exists if exists add  as target (mux/demux)
    //for each target find connection source
    // and instantiate target  until type is output node
}

util.inherits(Input,stream.Writable);
function Input(eventType){
    stream.Writable.call(this,{objectMode:true});
    this.outputs={};
    Type.findOne({name:eventType}).then(function(data){
        if(!data){
            throw new Error("Cannot find EventType: "+eventType);
        }
        //every output is a passthrough stream

        _.each(data.params,function(output){

        })



    })
    .fail(sails.log.error)

}

util.inherits(ConsoleStream,stream.Writable);
function ConsoleStream(){
    stream.Writable.call(this,{objectMode:true});
}
ConsoleStream.prototype._write =function(chunk,enc,next){
    sails.log.info(chunk);
    next();
};

util.inherits(CountTransform,stream.Transform);
function CountTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.count =0; //get count form Cache
}

CountTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        this.count +=1;
        //write to cache
        this.push(this.count);
    }

    next();
};

util.inherits(MaxTransform,stream.Transform);
function MaxTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.max =0; //get count form Cache
}

MaxTransform.prototype._transform = function(chunk,enc,next){
    if(chunk){
        if (chunk > this.max){
            this.max = chunk;
            //write to cache
            this.push(this.max);
        }
    }
    next();
};

util.inherits(MinTransform,stream.Transform);
function MinTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.min = Number.MAX_VALUE; //get count form Cache
}

MinTransform.prototype._transform = function(chunk,enc,next){
    if(chunk) {
        if (chunk < this.min) {
            this.min = chunk;
            //write to cache
            this.push(this.min);
        }
    }
    next();
};

util.inherits(AverageTransform,stream.Transform);
function AverageTransform(){
    stream.Transform.call(this,{objectMode:true});
    this.average = 0;
    this.value =0;
    this.count=0;//get count form Cache
}

AverageTransform.prototype._transform = function(chunk,enc,next){
    if(chunk) {
        this.value +=chunk;
        this.count +=1;
        var average= this.value /this.count;
        if (average !== this.average) {
            this.average = average;
            //write to cache
            this.push(this.average);
        }
    }
    next();
};

