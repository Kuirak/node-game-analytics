'use strict';
/**
 * Created by Jonas Kugelmann on 17.05.2014.
 */
var stream = require('stream')
    ,util = require('util')
    ,Q=require('q')
    ,Node =require('../lib/Node')
    ,Input =require('../lib/Node/InputNode');
var isRunning =false;
var runningSystems =[];


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