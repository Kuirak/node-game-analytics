'use strict';
/**
 * Created by Jonas Kugelmann on 02.06.2014.
 */
app.controller('NodeSystemController',function($scope,$state,nodeSystems,$sailsSocket,$rootScope){
    $rootScope.$on('editor.nodesystem.delete',function(event,args){
        _.remove($scope.nodeSystems,{id:args.id});
    });
    $scope.nodeSystems =nodeSystems.data;
    $scope.$watch('nodeSystem', function (newValue,OldValue) {
        if(newValue) {
            $state.go('editor.nodesystem', {id: newValue.id})
        }
    });
    $scope.createNodeSystem = function (name) {
        $sailsSocket.post('/api/nodesystem/',{name:name,nodes:[],connections:[]}).success(function(data){
            $scope.nodeSystems.push(data);
            $state.go('editor.nodesystem', {id: data.id});
        });
        $scope.nodeSystemName ='';
    };
});