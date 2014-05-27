'use strict';
/**
 * Created by Jonas Kugelmann on 17.05.2014.
 */
var stream = require('stream')
    ,util = require('util')
    ,Q=require('q')
    ,Node =require('../lib/Node')
    ,Input =require('../lib/Node/InputNode')
    ,ConstantNode =require('../lib/Node/InputNode')
    ,Transformations =require('../lib/Transformations');
var isRunning =false;
var runningSystems =[];
var inputs={};




module.exports={
  eventCreated: function(event){
      sails.log.verbose("Event created: ",event.type,event.session);
      //Put in to system
      //timestamp sort
      //wait until Event.stream() is Done then start  new Event.stream() until real time
      _.each(inputs[event.type],function(input){
          input.write(event);
      });

  },
  run: function(){
      //TODO start on server start
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
    }).fail(sails.log.error);

}

function setupNodeSystem(system){
    sails.log.verbose("Setting up System: "+system.name);
    var nodeSystem ={name:system.name,input:{},dbSource:system};
    var nodes= _.map(system.nodes,function(node){
            return Node.create(node);
    });
    nodeSystem.nodes =nodes;
    //filter Input and sort for eventType;
    _.chain(nodes)
        .select(function(node){return node instanceof Input;})
        .each(function(node){
            if(!nodeSystem.input[node.eventType]){
                nodeSystem.input[node.eventType] =[];
            }
            if(!inputs[node.eventType]){
                inputs[node.eventType] =[];
            }
            inputs[node.eventType].push(node);
            nodeSystem.input[node.eventType].push(node);
            //TODO maybe add system/event stream
        });
    sails.log.verbose("Setting up Nodes: "+system.name);
   var promises= _.chain(nodes).select(function(node){
        return node.init ? true:false;
   }).map(function(node){ //init returns promise
            return node.init();
   }).value();
    sails.log.verbose("Started Init for Nodes: "+system.name);
    //wait for all inits to be done
    Q.all(promises).then(function(){
        sails.log.verbose("Finished Init Nodes: "+system.name);
        sails.log.verbose("Attaching Connections: "+system.name);
        _.each(system.connections,function(conn){
            var source = _.find(nodes,{id:conn.source.node_id});
            var target = _.find(nodes,{id:conn.target.node_id});
            var output = source.outputs[conn.source.output];
            target.attachInput(conn.target.input, output);


        });

        _.each(nodes,function(node){
            if(!node.setupInputs)return;
            node.setupInputs();
        });
        sails.log.verbose("Attached Connections: "+system.name);
        sails.log.verbose("Starting Event Streams: "+system.name);
        _.forIn(nodeSystem.input,function(value,key){
            _.each(value,function(input){
                Event.stream({type:key},Transformations.none).pipe(input,{end:false});
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