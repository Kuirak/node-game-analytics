'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 * Node directive zur Darstellung der einzelnen Nodes
 */

app.directive("node",function(){
    return{
        restrict:"E",
        transclude:true,
        templateUrl:"/partials/editor.node.html",
        scope:{node:'='},
        controller: 'NodeController'
    }
});