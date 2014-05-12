/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        nodesystems:{collection:'nodesystem', via:"game"},
        events:{collection:'event',via:'game'},
        title:{type:'string',required:true},
        owner:{model:'user'},
        types:{collection:'type',via:'game'}
	}

};
