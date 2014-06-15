"use strict";
/**
* Event.js
*
* @description :: Das DatenModel für das Event
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoWatch:true,
  attributes: {
    type:{type:'string',required:true,notNull:true},
    params:{type:'json'},
    session_id:{type:'string',required:true,uuidv4:true},
    user_id:{type:'string',required:true,uuidv4:true},
   //TODO source_id:{type:'integer'},
    timestamp:{type:'string'},
    game:{model:'game'}
  },
    //Hier wird überprüft ob das Event alle richtigen Parameter hat
    //Für Optimierungszwecke sollte dies Verschoben werden in eine Policy und einen Service
    beforeCreate:function(values,done){
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
    },
    //nach erfolgreicher Erstellung wird der Eventprocessor benachrichtigt
    afterCreate:function(event,done){
        EventProcessor.eventCreated(event);
        done();
    }
};

