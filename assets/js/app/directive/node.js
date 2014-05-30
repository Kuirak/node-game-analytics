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
        controller: function($scope,$rootScope){
            $scope.removeNode=function(id){
                $rootScope.$emit('node.removed',{id:id});
            };

            $scope.connect = function(event,source,target){
                $rootScope.$emit('node.connected',{source:source,target:target});
            };

            $scope.eventTypes =$scope.$parent.eventTypes;
            $scope.keys =['global','session','user'];
            $scope.$watch('node.data.eventType',function(newValue,oldValue){
                if(newValue === oldValue){
                    return;
                }
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