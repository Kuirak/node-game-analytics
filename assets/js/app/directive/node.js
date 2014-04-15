'use strict';
/**
 * Created by Drako on 11.04.2014.
 */

app.directive("node",function(){
    return{
        restrict:"E",
        transclude:true,
        templateUrl:"/partials/editor.node.html",
        link: function(scope,el,attr){

        }
    }
});