'use strict';
/**
 * Created by Jonas Kugelmann on 27.05.2014.
 */
app.controller('DashboardController',function($scope,$sailsSocket){
    $scope.data ={} ;

    $scope.chartData=[];

    (function () {
        $sailsSocket.subscribe('event',function(message){
            if(message.verb ==='created'){
                var event = message.data;
                if(_.contains(_.keys($scope.data),event.type)){
                    $scope.data[event.type].data = event.params[_.first(_.keys(event.params))];
                    _.find($scope.chartData,{key:event.type}).values.push([_.parseInt(event.timestamp),event.params[_.first(_.keys(event.params))]]);
                }
            }
        });

       $sailsSocket.get('/api/type?internal=true').success(function(data){
           _.each(data,function(eventType){
               $scope.data[eventType.name]={name:eventType.name,data:0};
               $sailsSocket.get('/api/event?where={"type":"'+eventType.name+'"}&sort=id%20DESC').success(function(data){
                   if(data.length >0) {
                       $scope.data[data[0].type].data = data[0].params[_.first(_.keys(data[0].params))];
                       var series ={
                           key:eventType.name ,
                           values:[]
                       };
                       _.eachRight(data,function(event){
                           series.values.push([_.parseInt(event.timestamp),event.params[_.first(_.keys(event.params))]])
                       });
                       $scope.chartData.push(series);
                   }
               })
           })
       });


    }())


});