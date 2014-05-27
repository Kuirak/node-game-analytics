'use strict';
/**
 * Created by Jonas Kugelmann on 27.05.2014.
 */
app.controller('DashboardController',function($scope,$sailsSocket){
    $scope.maxScore = 0;
    $scope.averageScore = 0;
    $scope.minScore = 0;
    $scope.roundCount = 0;

    (function () {
       $sailsSocket.subscribe('event',function(message){
           if(message.verb ==='created'){
               var event = message.data;
               if(event.type ==='RoundCount'){
                   $scope.roundCount = event.params.value;
               }else if(event.type === 'MaxScore'){
                   $scope.maxScore = event.params.value;
               }else if(event.type === 'MinScore'){
                   $scope.minScore = event.params.value;
               }else if(event.type === 'AverageScore'){
                   $scope.averageScore = event.params.value;
               }
           }
       });
        $sailsSocket.get('/api/event?where={"type":"RoundCount"}').success(function(data){
            if(data.length >0) {
                $scope.roundCount = _.last(data).params.value;
            }
        });
        $sailsSocket.get('/api/event?where={"type":"MaxScore"}').success(function(data){
            if(data.length >0) {
                $scope.maxScore = _.last(data).params.value;
            }
        });
        $sailsSocket.get('/api/event?where={"type":"MinScore"}').success(function(data){
            if(data.length >0) {
                $scope.minScore = _.last(data).params.value;
            }
        });
        $sailsSocket.get('/api/event?where={"type":"AverageScore"}').success(function(data){
            if(data.length >0) {
                $scope.averageScore = _.last(data).params.value;
            }
        });

    }())


});