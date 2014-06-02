'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */
app.controller("EditorController",function($scope,$sailsSocket,nodeSystem,eventTypes,$state,$rootScope,NodeType){
    $scope.nodeSystem =nodeSystem.data;

    $scope.nodeTypes= NodeType;
    $scope.selectedNode =null;
    $scope.connecting=false;
    $scope.connections =null;
    $scope.nodes=$scope.nodeSystem.nodes;
    $scope.eventTypes =eventTypes.data;

    $rootScope.$on('node.removed',function(event,args){
        _.remove($scope.nodes,{id:args.id});
        _.remove($scope.connections,function(conn){
            return conn.source.node.id === args.id || conn.target.node.id ===args.id;
        })
    });


    $rootScope.$on('node.connected',function(event,connection){
        if(connection.source.node_id === connection.target.node_id){
            return;
        }
        var source = _.find($scope.nodes,{id:connection.source.node_id});
        var target = _.find($scope.nodes,{id:connection.target.node_id});
        var output = _.find(source.outputs,{name: connection.source.outputname});
        var input = _.find(target.inputs,{name:connection.target.inputname});
        var sourcePos= $scope.calculateSourcePos(source,connection.source.outputname);
        var targetPos= $scope.calculateTargetPos(target,connection.target.inputname);
        var conn= {
            source:{node:source,output: output,pos:sourcePos},
            target:{node:target,input: input,pos:targetPos}
        };
        //connection exits
        if(_.find($scope.connections,conn)){
            return;
        }
        //connection with same target exists
        if(_.find($scope.connections,{target:target})){
            return;
        }
       $scope.connections.push(conn);
    });


    $rootScope.$on('node.position.changed',function(){
        _.each($scope.connections,function(conn){
            $scope.$apply(function(){
                conn.target.pos =$scope.calculateTargetPos(conn.target.node,conn.target.input.name,conn.target.pos);
                conn.source.pos =$scope.calculateSourcePos(conn.source.node,conn.source.output.name,conn.source.pos);
            });
        });
    });


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


    $scope.start = function () {
        $sailsSocket.get('/api/nodesystem/'+$scope.nodeSystem.id+'/start').success(function(){
            console.log('Running');
        })
    };


    $scope.createNode=function(nodeType){
        var id =_.max($scope.nodes,'id').id +1 || 1;
        var node = {
            x:0,
            y:0,
            id: id,
            data:{
                nodeType:nodeType,
                key:'global'
            }
        };
        if(nodeType === NodeType.input){
            var eventType =_.first($scope.eventTypes);
            node.data.eventType = eventType.name;
            node.outputs =[{name:'timestamp',type:'timestamp'}];
            _.each(eventType.params,function(output){
                $scope.node.outputs.push(output);
            })
        }else if(nodeType ===NodeType.count){
            node.outputs=[{name:'count',type:'number'}];
            node.inputs=[{name:'value',type:'number'}];
        }else if( nodeType === NodeType.valueOutput){
            node.inputs=[{name:'value',type:'number'}];
        }else if(nodeType === NodeType.min|| nodeType === NodeType.max||nodeType===NodeType.average){
            node.outputs=[{name:nodeType,type:'number'}];
            node.inputs=[{name:'value',type:'number'}];
        }else if(nodeType ===NodeType.equals){
            node.inputs=[{name:'first',type:'number'},{name:'second',type:'number'}];
            node.outputs=[{name:'true',type:'number'},{name:'false',type:'number'}];
        }else if(nodeType ===NodeType.constant){
            node.outputs=[{name:'constant',type:'number'}];
            node.data.constant =0;
        }else if(nodeType === NodeType.countNotChanging){
            node.inputs=[{name:'value',type:'number'},{name:'threshold',type:'number'}];
            node.outputs=[{name:'count',type:'number'}];
        }
        $scope.nodes.push(node);
    };


   $scope.calculateSourcePos= function (node,outputname,pos){
        var spaceBetweenOutputs =23;
       var result={x:node.x +180,y:node.y};
       if(pos){
           result =pos;
           result.x =node.x +180;
           result.y =node.y;
       }
        var index = _.findIndex(node.outputs,{name:outputname});
        if(node.data.nodeType === NodeType.input || node.data.nodeType === NodeType.constant ){
            var outputOffset =90;
            result.y += outputOffset + index * spaceBetweenOutputs;
        }else{
            var offset =66;
            result.y += offset + index * spaceBetweenOutputs;
        }
        return result;
    };
   $scope.calculateTargetPos= function (node,inputname,pos){
        var spaceBetweenInputs =23;
       var result={x:node.x,y:node.y};
       if(pos){
           result =pos;
           result.x =node.x;
           result.y =node.y;
       }
        var index = _.findIndex(node.inputs,{name:inputname});
        if(node.data.nodeType === NodeType.valueOutput){
            var outputOffset =90;
            result.y += outputOffset + index * spaceBetweenInputs;
        }else{
            var offset =66;
            result.y += offset + index * spaceBetweenInputs;
        }
        return result;
    };


    (function init(){
        $scope.connections = _.map($scope.nodeSystem.connections,function(connection){
            var source= _.find($scope.nodes,{id:connection.source.node_id});
            var target= _.find($scope.nodes,{id:connection.target.node_id});
            var sourcePos= $scope.calculateSourcePos(source,connection.source.output);
            var targetPos= $scope.calculateTargetPos(target,connection.target.input);
          return  {
              source:{node:source,output: _.find(source.outputs,{name:connection.source.output}),pos:sourcePos},
              target:{node:target,input: _.find(target.inputs,{name:connection.target.input}),pos:targetPos}
          }
        })
    }());
});