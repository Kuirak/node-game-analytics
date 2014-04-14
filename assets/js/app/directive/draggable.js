'use strict';
/**
 * Created by Drako on 11.04.2014.
 */
app.directive('draggable',['$document',function($document){
    return {link:function(scope,element,attr){
        var startX = 0,startY = 0,x= 0,y=0;
        element.css({
            position:'relative',
            cursor:'move'
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
        }
    }}
}]);