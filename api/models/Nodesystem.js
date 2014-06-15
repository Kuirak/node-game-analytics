/**
 * Nodesystem.js
 *
 * @description :: Datenmodell für das NodeSystem
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        name:{type:'string',required:true},
        nodes:'json',
        connections:'json',
        game:{model:'game'}
	}
};
