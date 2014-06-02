'use strict';
/**
 * Created by Jonas Kugelmann on 25.04.2014.
 */
app.controller('TypeController',function($scope, $sailsSocket,$http, $stateParams,types){
    $scope.types=types.data;
    $scope.selectedType = _.find($scope.types,{name:$stateParams.type});
    $scope.paramTypes=['number','vector3','string'];

    $scope.deleteType = function (type) {
        $sailsSocket.delete('/api/type/' +type.id).success(function(data){
            _.remove($scope.types,{id:data.id});
        });
    };

    $scope.createType = function (name) {
        if(!name){
            return;
        }
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
        if(!name || !type){
            return;
        }
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

    $scope.deleteParam = function (param) {
        _.remove($scope.selectedType.params,param);
    };
});