'use strict';
/**
 * Created by Jonas Kugelmann on 14.05.2014.
 * Directive um den Effekt von node-draggable aufzuheben,
 * damit Inputelemente wieder auf Mouseevents reagieren
 */
app.directive('notNodeDraggable',function(){
    return{link:function(scope,element,attr){
        element.on('mousedown',function(event){
            event.stopPropagation();
        });
    }}
});