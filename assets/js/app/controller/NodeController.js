'use strict';
/**
 * Created by Jonas Kugelmann on 01.06.2014.
 * Controller für einzelne Nodes
 */
app.controller('NodeController',function($scope,$rootScope){
    //Sendet Event das der Node gelöscht werden soll
    $scope.removeNode=function(id){
        $rootScope.$emit('node.removed',{id:id});
    };

    //Sendet Event das der Node verbunden werden soll
    $scope.connect = function(event,source,target){
        $rootScope.$emit('node.connected',{source:source,target:target});
    };

    //TODO remove $parent dependency
    $scope.eventTypes =$scope.$parent.eventTypes;

    $scope.keys =['global','session','user'];
    //beobachtet ob sich der Eventtype verändert um dann die Outputs zu verändern und
    //Verbindungen zu trennen
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