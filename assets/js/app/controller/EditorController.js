'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */
app.controller("EditorController",function($scope){
    var connections = [
        {"source":{node_id:1,"output_idx":0},"target":{node_id:2, "input_idx":0}},
        {"source":{node_id:2,"output_idx":0},"target":{node_id:4,  "input_idx":0}}
    ];

    $scope.selectedNode =null;
    $scope.connecting=false;
    $scope.connections =null;


    $scope.nodes=[
        {
            "id":1,
            "title":"Input Node",
            "outputs":[{"title":"output1",type:'number'}],
            "x":10,
            "y":10
        },{
            "id":2,
            "title":"Processing Node",
            "outputs":[{"title":"output1",type:'number'}],
            "inputs":[{"title":"input1",type:'number'},{"title":"input2",type:'vector3'}],
            "x":200,
            "y":200
        },{
            "id":3,
            "title":"Input Node 2",
            "outputs":[{"title":"output1",type:'number'},{"title":"output2",type:'vector3'}],
            "x":100,
            "y":100
        },{
            "id":4,
            "title":"Output Node",
            "inputs":[{"title":"input1",type:'number'}],
            "x":0,
            "y":200
        }
    ];

    $scope.connect = function(event,source,target){
        console.log(source,target);
        var connection= {source:source,target:target};
        //connection exits
        if(_.find($scope.connections,connection)){
            return;
        }
        //Connection with same source exists
        if(_.find($scope.connections,{source:source})){
            return;
        }
        //connection with same target exists
        if(_.find($scope.connections,{target:target})){
            return;
        }
        $scope.connections.push(connection);
    };

    $scope.unconnect =function(connection){
        _.remove($scope.connections,connection);
    };

    $scope.save = function(){

    };

    (function init(){
        $scope.connections = _.map(connections,function(connection){
            var source= _.find($scope.nodes,{id:connection.source.node_id});
            var target= _.find($scope.nodes,{id:connection.target.node_id});
          return  {
              source:{node:source,output: source.outputs[connection.source.output_idx]},
              target:{node:target,input: target.inputs[connection.target.input_idx]}
          }
        })
    }());
});