"use strict";
/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    type:{type:'string',required:true,notNull:true},
    params:{type:'json'},
    session_id:{type:'string',required:true,uuidv4:true},
    user_id:{type:'string',required:true,uuidv4:true},
    timestamp:{type:'string'},
    game:{model:'game'}
  },beforeCreate:function(values,done){
        //TODO move to policy
        Type.findOne({name:values.type}).then(function(type){
            if(!type.params){
                done();
                return;
            }else if(!values.params){
                done(new Error("Event params missing "+ value.type));
                return;
            }
            if(_.difference(_.map(type.params,function(param){return param.name;}), _.keys(values.params)).length >0){

                done(new Error("Event type params not matching: " + values.type +" | " + type.name));
            }else{
                //TODO validate types
                done();
            }
        })
    },afterCreate:function(event,done){

    }
};

