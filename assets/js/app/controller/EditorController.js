'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */
app.controller("EditorController",function($scope,$sailsSocket,nodeSystem,eventTypes){
    $scope.nodeSystem =nodeSystem.data;
    $scope.nodeTypes= ['input','count','valueOutput'];
    var connections =$scope.nodeSystem.connections;
    $scope.selectedNode =null;
    $scope.connecting=false;
    $scope.connections =null;
    $scope.nodes=$scope.nodeSystem.nodes;
    $scope.eventTypes =eventTypes.data;

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
        $scope.nodeSystem.connections= _.map($scope.connections,function(conn){
            var output_idx = _.findIndex(conn.source.node.outputs,conn.source.output);
            var input_idx = _.findIndex(conn.target.node.inputs,conn.target.input);
            return{
                source:{node_id:conn.source.node.id,output_idx:output_idx},
                target:{node_id:conn.target.node.id,input_idx:input_idx}
            };
        });
        $sailsSocket.put('/api/nodesystem/'+$scope.nodeSystem.id,$scope.nodeSystem).success(function(data){
            console.log("Saved ",data);
        })
    };

    $scope.createNode=function(nodeType){
        var id =_.max($scope.nodes,'id').id +1 || 1;
        var node = {
            x:0,
            y:0,
            id: id,
            data:{
                nodeType:nodeType
            },
        };
        if(nodeType ==='input'){
            var eventType =_.first($scope.eventTypes);
            node.data.eventType = eventType.name;
            node.outputs =[{name:'time',type:'timestamp'}];
            _.each(eventType.params,function(output){
                $scope.node.outputs.push(output);
            })
        }else if(nodeType ==='count'){
            node.outputs=[{name:'count',type:'number'}];
            //TODO add value channel
            node.inputs=[{name:'value',type:'number'}];
        }
        $scope.nodes.push(node);
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