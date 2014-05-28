"use strict";
/**
 * NodesystemController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	run:function(req,res){
       EventProcessor.run();
       res.end();

    },startNodeSystem: function(req,res){
        var id = req.param('id');
        Nodesystem.findOne(id).then(function(data){
            EventProcessor.startNodeSystem(data);
            res.end();
        }).fail(res.serverError)
    }
};
