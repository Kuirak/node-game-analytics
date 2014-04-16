'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 */
app.controller("EditorController",function($scope, d3){
    $scope.selectedNode =null;
    $scope.connecting=false;

    $scope.nodes=[
        {
            "node_id":1,
            "title":"Input Node",
            "connections":{"node_id":2,"output_id":1, "input_id":1},
            "outputs":[{"output_id":1,"title":"output1",type:'number'}],
            "x":10,
            "y":10
        },{
            "node_id":2,
            "title":"Processing Node",
            "outputs":[{"output_id":1,"title":"output1",type:'number'},{"output_id":2,"title":"output2",type:'number'}],
            "connections":{"node_id":4, "output_id":1, "input_id":1},
            "inputs":[{"input_id":1,"title":"input1",type:'number'},{"input_id":2,"title":"input2",type:'vector3'}],
            "x":200,
            "y":200
        },{
            "node_id":3,
            "title":"Input Node 2",
            "connections":{"node_id":2, "input_id":2},
            "outputs":[{"output_id":1,"title":"output1",type:'number'},{"output_id":2,"title":"output2",type:'vector3'}],
            "x":100,
            "y":100
        },{
            "node_id":4,
            "title":"Output Node",
            "inputs":[{"input_id":1,"title":"input1",type:'number'}],
            "x":0,
            "y":200
        }
    ];

    $scope.connect = function($event,$data,options){
         console.log($data);
    }
});