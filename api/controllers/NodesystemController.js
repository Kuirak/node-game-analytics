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

    }
};
