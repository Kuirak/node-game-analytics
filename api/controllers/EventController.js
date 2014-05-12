"use strict";
/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    subscribe:function(req,res){
        if(req.isSocket) {
            Event.watch(req.socket);
            res.end(200);
        }

    },
};

