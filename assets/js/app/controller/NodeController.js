'use strict';
/**
 * Created by Jonas Kugelmann on 01.06.2014.
 */
app.controller('NodeController',function($scope,$rootScope){
    $scope.removeNode=function(id){
        $rootScope.$emit('node.removed',{id:id});
    };

    $scope.connect = function(event,source,target){
        $rootScope.$emit('node.connected',{source:source,target:target});
    };

    //TODO remove $parent dependency
    $scope.eventTypes =$scope.$parent.eventTypes;

    $scope.keys =['global','session','user'];
    $scope.$watch('node.data.eventType',function(newValue,oldValue){
        if(newValue === oldValue){
            return;
        }
        if(newValue){
            var eventType = _.find($scope.eventTypes,{name:newValue});
            $scope.node.outputs =[{name:'timestamp',type:'timestamp'}];
            _.each(eventType.params,function(output){
                $scope.node.outputs.push(output);
            });
            //TODO remove $parent dependency
            _.remove($scope.$parent.connections,function(conn){
                if(conn.source.output.type ==='timestamp')return false;
                return conn.source.node.id === $scope.node.id ;});

        }
    });


});