'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var Node = require('./Node')
    ,util = require('util');

util.inherits(ConstantNode,Node);
function ConstantNode(id,constant){
    Node.call(this,id,{
        outputs:[{name:'constant',type:'number'}]
    });
    this.constant =constant;
    this.outputs.constant =constant;
}



module.exports =ConstantNode;