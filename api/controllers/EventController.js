/**
 * EventController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	subscribe:function(req,res){
        "use strict";
        if(req.isSocket) {
            Event.watch(req.socket);
            res.end(200);
        }

    },
//    afterCreate:function(values, done){
//        "use strict";
//        Event.publishCreate(values);
//        done();
//    }


};
