'use strict';
/**
 * Created by Jonas Kugelmann on 02.06.2014.
 * Der NodeSystemController kümmert sich um das erstellen und löschen von NodeSystemen
 */
app.controller('NodeSystemController',function($scope,$state,nodeSystems,$sailsSocket,$rootScope){
    //Sendet Event dass das NodeSystem gelöscht  wurde
    $rootScope.$on('editor.nodesystem.delete',function(event,args){
        _.remove($scope.nodeSystems,{id:args.id});
    });
    $scope.nodeSystems =nodeSystems.data;
    //beobachtet ob sich der Wert von nodesytem verändert und soll dann den State wechseln
    $scope.$watch('nodeSystem', function (newValue,OldValue) {
        if(newValue) {
            $state.go('editor.nodesystem', {id: newValue.id})
        }
    });
    //startet Alle vorhandenen NodeSystem auf dem Server
    $scope.startAll = function () {
        _.each($scope.nodeSystems,function(nodeSystem){
            $sailsSocket.get('/api/nodesystem/'+nodeSystem.id+'/start').success(function(){
            });
        });
    };

    //Erstellt ein neues leeres NodeSystem
    $scope.createNodeSystem = function (name) {
        $sailsSocket.post('/api/nodesystem/',{name:name,nodes:[],connections:[]}).success(function(data){
            $scope.nodeSystems.push(data);
            $state.go('editor.nodesystem', {id: data.id});
        });
        $scope.nodeSystemName ='';
    };
});