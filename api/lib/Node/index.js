'use strict';
/**
 * Created by Jonas Kugelmann on 26.05.2014.
 * Node factory
 */
var NodeType =require('./NodeType')
    ,CountNode =require('./CountNode')
    ,MaxNode =require('./MaxNode')
    ,MinNode =require('./MinNode')
    ,AverageNode =require('./AverageNode')
    ,ValueOutputNode =require('./ValueOutputNode')
    ,InputNode =require('./InputNode')
    ,ConstantNode =require('./ConstantNode')
    ,CountNotChangingNode =require('./CountNotChangingNode')
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
        return new ValueOutputNode(node.id,node.data.outputType);
    }else if(node.data.nodeType ===NodeType.input){
        return new InputNode(node.id,node.data.eventType);
    }else if(node.data.nodeType ===NodeType.equals){
        return new EqualsNode(node.id);
    }else if(node.data.nodeType ===NodeType.constant){
        return new ConstantNode(node.id,node.data.constant);
    }else if(node.data.nodeType ===NodeType.countNotChanging){
        return new CountNotChangingNode(node.id);
    }

}
exports.create =create;