'use strict';
/**
 * Created by Drako on 14.04.2014.
 */
app.directive('connector',['$document',function($document){
    return {
        controller:"EditorController",
        link:function(scope,element,attr,EditorCtrl){
        var startX = 0,startY = 0,x= 0,y=0;
        element.css({
            position:'relative',
            cursor:'crosshair'
        });
        element.on('mousedown',function(event){
            EditorCtrl.selectedNode =element;
            event.stopPropagation();
            event.preventDefault();
            startX =event.pageX-x;
            startY =event.pageY-y;
            $document.on('mousemove',mousemove);
            $document.on('mouseup',mouseup);
        });
        element.on('mouseup',function(event){
            if(EditorCtrl.connecting && EditorCtrl.selectedNode !== element){
                EditorCtrl.connect({targetNode:scope.node.node_id,output_id:0})
            }
        });


        function mousemove(event){
            x= event.pageX -startX;
            y= event.pageY -startY;
            //TODO add connection


        }
        function mouseup(){
            EditorCtrl.selectedNode =null;
            $document.unbind('mousemove',mousemove);
            $document.unbind('mouseup',mouseup);
        }
    }}
}]);