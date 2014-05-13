'use strict';
app.controller("MainController", function ($scope,$sailsSocket ) {

    $scope.message ="Just a test message";
    $scope.events =[];
    $scope.deleteEvent = function (id) {
        $sailsSocket.delete('/api/event/'+id).success(function(data){
            _.remove($scope.events,function(event){
                return event.id ===id;
            })
            }).error(function(err){
            $scope.error =err;
        })
    };
    (function(){

        $sailsSocket.subscribe('event',function(message){
            if(message.verb ==='created'){
                $scope.events.push(message.data);
            }
        });
        $sailsSocket.get('/api/event').success(function(data){
            $scope.events =data;
        }).error(function(err){
            $scope.error =err;
        });


    }());

});


