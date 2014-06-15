/**
 * Game.js
 *
 * @description :: Datenmodell für das Game - wird im Moment nicht verwendet
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
