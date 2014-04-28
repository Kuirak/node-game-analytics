'use strict';
/**
 * Created by Jonas Kugelmann on 25.04.2014.
 */
app.controller('TypeController',function($scope, $sailsSocket,$http, $stateParams,types){
    console.log(types);
    $scope.types=types.data;
    $scope.selectedType = _.find($scope.types,{name:$stateParams.type});
    $scope.paramTypes=['number','vector3','string'];

    $scope.deleteType = function (type) {
        $sailsSocket.delete('/api/type/' +type.id).success(function(data){
            _.remove($scope.types,{id:data.id});
        });
    };

    $scope.createType = function (name) {
        $scope.newTypeName ='';
        $sailsSocket.post('/api/type',{name:name}).success(function(data){
            console.log(data);
            $scope.types.push(data);
        }).catch(console.error);
    };

    $scope.saveSelectedType =function(){
        console.log("Saving Selected type",$scope.selectedType);
        //TODO switch back to $sailssocket
        //TODO ask robdubya
        $http.put('/api/type/'+$scope.selectedType.id,angular.toJson($scope.selectedType),function(data){
           console.log("Saved ",data.name);
       });
//            .success(function(data){
//           console.log("Saved ",data.name);
//        }).catch(console.error);
    };
    $scope.createParam = function (name,type) {
        console.log(name,type);
        if(!$scope.selectedType.params){
            $scope.selectedType.params =[];
        }
        if(_.find($scope.selectedType.params,{name:name})){
            //TODO show error wrong name
            console.error("name exists");
            return;
        }
        $scope.newParamName='';
        $scope.selectedType.params.push({name:name,type:type})
    };

//    (function init(){
//        $sailsSocket.get('/api/type').success(function(data){
//            $scope.types =data;
//        }).catch(console.error);
//        //TODO ask robdubya
//        //verbose: Routing message over socket:  { method: 'get', data: {}, url: '/api/type', headers: {} }
//        //debug: Deprecated:   `Model.subscribe(socket, null, ...)`
//        //debug: (see http://links.sailsjs.org/docs/config/pubsub)
//        //debug: Please use instance rooms instead (or raw sails.sockets.*() methods.)
//    }());
});