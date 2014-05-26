'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 */
var NodeType =require('./NodeType')
    ,CountNode =require('./CountNode')
    ,MaxNode =require('./MaxNode')
    ,MinNode =require('./MinNode')
    ,AverageNode =require('./AverageNode')
    ,ValueOutputNode =require('./ValueOutputNode')
    ,InputNode =require('./InputNode')
    ,EqualsNode =require('./EqualsNode');

function create(node){
    if(node.data.nodeType === NodeType.count){
        return new CountNode(node.id);
    }else if(node.data.nodeType === NodeType.max){
        return new MaxNode(node.id);
    }else if(node.data.nodeType === NodeType.min){
        return new MinNode(node.id);
    }else if(node.data.nodeType === NodeType.average){
        return new AverageNode(node.id);
    }else if(node.data.nodeType === NodeType.valueOutput){
        return new ValueOutputNode(node.id);
    }else if(node.data.nodeType ===NodeType.input){
        return new InputNode(node.id,node.data.eventType);
    }else if(node.data.nodeType ===NodeType.equals){
        return new EqualsNode(node.id);
    }

}
exports.create =create;