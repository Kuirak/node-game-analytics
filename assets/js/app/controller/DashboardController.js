'use strict';
/**
 * Created by Jonas Kugelmann on 27.05.2014.
 * Platzhalter Controller für das Dashboard
 */
app.controller('DashboardController',function($scope,$sailsSocket){
    $scope.data ={} ;

    $scope.chartData=[];

    (function () {
        //Event listener wenn neue Events erstellt werden
        //schiebt die Events in die dazugehörigen Arrays
        $sailsSocket.subscribe('event',function(message){
            if(message.verb ==='created'){
                var event = message.data;
                if(_.contains(_.keys($scope.data),event.type)){
                    $scope.data[event.type].data = event.params[_.first(_.keys(event.params))];
                    _.find($scope.chartData,{key:event.type}).values.push([_.parseInt(event.timestamp),event.params[_.first(_.keys(event.params))]]);
                }
            }
        });

        //Holt die Initial Daten und Datentypen
        //Filtert auf interne Eventtypen, also NodeSystemOutputs
       $sailsSocket.get('/api/type?internal=true').success(function(data){
           _.each(data,function(eventType){
               $scope.data[eventType.name]={name:eventType.name,data:0};
               $scope.chartData.push({
                   key:eventType.name ,
                   values:[]
               });
               $sailsSocket.get('/api/event?where={"type":"'+eventType.name+'"}&sort=id%20DESC').success(function(data){
                   if(data.length >0) {
                       $scope.data[data[0].type].data = data[0].params[_.first(_.keys(data[0].params))];
                       var series = _.find($scope.chartData,{key:data[0].type});
                       _.eachRight(data,function(event){
                           series.values.push([_.parseInt(event.timestamp),event.params[_.first(_.keys(event.params))]])
                       });

                   }
               })
           })
       });


    }())


});