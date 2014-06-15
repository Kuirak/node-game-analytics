"use strict";
/**
 * NodesystemController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    // Controller action um ein Node System zu starten
	startNodeSystem: function(req,res){
        var id = req.param('id');
        Nodesystem.findOne(id).then(function(data){
            EventProcessor.startNodeSystem(data);
            res.end();
        }).fail(res.serverError)
    }
};
