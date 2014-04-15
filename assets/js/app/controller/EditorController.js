'use strict';
/**
 * Created by Drako on 11.04.2014.
 */
app.controller("EditorController",function($scope, d3){


    $scope.nodes=[
        {
            "node_id":1,
            "title":"Input Node",
            "connections":{"id":2,"output_id":1, "input_id":1},
            "outputs":[{"output_id":1,"title":"output1",type:'number'}],
            "visual":{
                "x":10,"y":10
            }
        },{
            "node_id":2,
            "title":"Processing Node",
            "outputs":[{"output_id":1,"title":"output1",type:'number'},{"output_id":2,"title":"output2",type:'number'}],
            "connections":{"node_id":4, "output_id":1, "input_id":1},
            "inputs":[{"input_id":1,"title":"input1",type:'number'},{"input_id":2,"title":"input2",type:'number'}],
            "visual":{
                "x":100,"y":100
            }
        },{
            "node_id":3,
            "title":"Input Node 2",
            "connections":{"node_id":2, "input_id":2},
            "outputs":[{"output_id":1,"title":"output1",type:'number'},{"output_id":2,"title":"output2",type:'number'}],
            "visual":{
                "x":10,"y":100
            }
        },{
            "node_id":4,
            "title":"Output Node",
            "inputs":[{"input_id":1,"title":"input1",type:'number'}],
            "visual":{
                "x":100,"y":500
            }
        }
    ];

    $scope.connect = function(node_id,output_id){
        console.log(_.find($scope.nodes,{node_id:node_id}).title+':'+output_id);
    }
});