"use strict";
/**
 * Type.js
 *
 * @description :: Datenmodell für den (event)-type
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	attributes: {
        name:{type:'string',required:true},
        params:'json',
        game:{model:'game'},
        internal:{type:'boolean',defaultsTo:false}
	}
};
