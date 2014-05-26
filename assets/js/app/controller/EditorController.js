'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */
app.controller("EditorController",function($scope,$sailsSocket,nodeSystem,eventTypes,$state,$rootScope){
    $scope.nodeSystem =nodeSystem.data;
    $scope.nodeTypes= ['input','count','valueOutput','max','min','average','equals','constant','countNotChanging'];
    var connections =$scope.nodeSystem.connections;
    $scope.selectedNode =null;
    $scope.connecting=false;
    $scope.connections =null;
    $scope.nodes=$scope.nodeSystem.nodes;
    $scope.eventTypes =eventTypes.data;



    $scope.unconnect =function(connection){
        _.remove($scope.connections,connection);

    };

    $scope.save = function(){
        $scope.nodeSystem.connections= _.map($scope.connections,function(conn){
            var output = conn.source.output.name;
            var input= conn.target.input.name;
            return{
                source:{node_id:conn.source.node.id,output:output},
                target:{node_id:conn.target.node.id,input:input}
            };
        });
        $sailsSocket.put('/api/nodesystem/'+$scope.nodeSystem.id,$scope.nodeSystem).success(function(data){
            console.log("Saved ",data);
        })
    };
    $scope.remove = function () {
        $sailsSocket.delete('/api/nodesystem/'+$scope.nodeSystem.id).success(function(data){
            $state.go('editor');
            $rootScope.$emit('editor.nodesystem.delete',{id:data.id});
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
            }
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
        }else if( nodeType === 'valueOutput'){
            node.inputs=[{name:'value',type:'number'}];
        }else if(nodeType === 'min'|| nodeType ==='max'||nodeType==='average'){
            node.outputs=[{name:nodeType,type:'number'}];
            node.inputs=[{name:'value',type:'number'}];
        }else if(nodeType ==='equals'){
            node.inputs=[{name:'first',type:'number'},{name:'second',type:'number'}];
            node.outputs=[{name:'true',type:'number'},{name:'false',type:'number'}];
        }else if(nodeType ==='constant'){
            node.outputs=[{name:'constant',type:'number'}];
            node.data.constant =0;
        }else if(nodeType ==='countNotChanging'){
            node.inputs=[{name:'value',type:'number'},{name:'threshold',type:'number'}];
            node.outputs=[{name:'count',type:'number'}];
        }
        $scope.nodes.push(node);
    };

    (function init(){
        $scope.connections = _.map(connections,function(connection){
            var source= _.find($scope.nodes,{id:connection.source.node_id});
            var target= _.find($scope.nodes,{id:connection.target.node_id});
          return  {
              source:{node:source,output: _.find(source.outputs,{name:connection.source.output})},
              target:{node:target,input: _.find(target.inputs,{name:connection.target.input})}
          }
        })
    }());
});