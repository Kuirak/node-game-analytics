'use strict';
/**
 * Created by Jonas Kugelmann on 11.04.2014.
 * BasedOn: http://stackoverflow.com/questions/20393855/angularjs-draggable-directive
 */
app.directive('nodeDraggable',['$document',function($document){
    return {link:function(scope,element,attr){
        // to prevent  dragging  drag n drop items ad node-draggable directive and it negates the effect
        var startX = 0,startY = 0,x= scope.node.x,y=scope.node.y;
        element.css({
            position:'absolute',
            cursor:'move',
            left:x+'px',
            top:y+'px'
        });
        element.on('mousedown',function(event){
            event.stopPropagation();
            event.preventDefault();
            startX =event.pageX-x;
            startY =event.pageY-y;
            $document.on('mousemove',mousemove);
            $document.on('mouseup',mouseup);
        });

        function mousemove(event){
            x= event.pageX -startX;
            y= event.pageY -startY;
            element.css({
                left:x+'px',
                top:y+'px'
            });
        }
        function mouseup(){
            $document.unbind('mousemove',mousemove);
            $document.unbind('mouseup',mouseup);
            scope.node.x=x;
            scope.node.y=y;
        }
    }}
}]);