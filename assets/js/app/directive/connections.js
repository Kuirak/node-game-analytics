'use strict';
/**
 * Created by Jonas Kugelmann on 30.05.2014.
 */
app.directive("connection",function() {
    return{
        restrict: "E",
        replace: true,
        template: '<line class="ng-hide"></line>',
        scope: {conn: '='},
        link: function (scope, element, attrs) {
            element.css({
                stroke: 'green',
                'stroke-width':2
            });
           element.attr('x1' , scope.conn.source.node.x);
           element.attr('y1' , scope.conn.source.node.y);
           element.attr('x2' , scope.conn.target.node.x);
           element.attr('y2' , scope.conn.target.node.y);
           element.removeClass('ng-hide');

        }
    }
});