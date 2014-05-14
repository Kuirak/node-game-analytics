'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */

app.directive("node",function(){
    return{
        restrict:"E",
        transclude:true,
        templateUrl:"/partials/editor.node.html",
        scope:{node:'='},
        controller: function($scope){
            $scope.removeNode=function(id){
                _.remove($scope.$parent.nodes,{id:id});
                _.remove($scope.$parent.connections,function(conn){
                    return conn.source.node.id === id || conn.target.node.id ===id;
                })
            };
            $scope.connect = function(event,source,target){
                console.log(source,target);
                var connection= {source:source,target:target};
                if(source.node.id === target.node.id){
                    return;
                }
                //connection exits
                if(_.find($scope.$parent.connections,connection)){
                    return;
                }
                //Connection with same source exists
                if(_.find($scope.$parent.connections,{source:source})){
                    return;
                }
                //connection with same target exists
                if(_.find($scope.$parent.connections,{target:target})){
                    return;
                }
                $scope.$parent.connections.push(connection);
            };

            $scope.eventTypes =$scope.$parent.eventTypes;
            $scope.$watch('node.data.eventType',function(newValue,oldValue){
               if(newValue){
                   var eventType = _.find($scope.eventTypes,{name:newValue});
                   $scope.node.outputs =[{name:'time',type:'timestamp'}];
                   _.each(eventType.params,function(output){
                       $scope.node.outputs.push(output);
                   });
                   _.remove($scope.$parent.connections,function(conn){
                       if(conn.source.output.type ==='timestamp')return false;
                       return conn.source.node.id === $scope.node.id ;});

               }
            });

        },
        link: function(scope,el,attr){

        }
    }
});