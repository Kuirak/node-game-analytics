'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
//removes standard transformations of Waterlines stream()
var Transformations=module.exports ={};
Transformations.none={};
Transformations.none.write =function(model,index,next){
    next(null,model);
};
Transformations.none.end =function(next){
    next(null);
};