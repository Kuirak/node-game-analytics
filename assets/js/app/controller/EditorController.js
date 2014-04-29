'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */
app.controller("EditorController",function($scope,$sailsSocket,nodeSystem){
    $scope.nodeSystem =nodeSystem.data;
    var connections =$scope.nodeSystem.connections;
    $scope.selectedNode =null;
    $scope.connecting=false;
    $scope.connections =null;
    $scope.nodes=$scope.nodeSystem.nodes;

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