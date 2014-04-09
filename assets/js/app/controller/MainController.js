'use strict';
app.controller("MainController", function ($scope,$sails ) {

    $scope.message ="Just a test message";
    $scope.events =[];
    $scope.deleteEvent = function (id) {
        $sails.delete('/api/event/'+id).success(function(data){
            _.remove($scope.events,function(event){
                return event.id ===id;
            })
            }).error(function(err){
            $scope.error =err;
        })
    };
    (function(){

        $sails.get('/api/event').success(function(data){
            $scope.events =data;
        }).error(function(err){
            $scope.error =err;
        });
        $sails.get('/api/event/subscribe').success(function(data){

        });
        $sails.on('event',function(message){
            if(message.verb ==='created'){
                $scope.events.push(message.data);
            }
        })
    }());

});


