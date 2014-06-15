"use strict";
/**
 * User.js
 *
 * @description :: Datenmodell für den User - wrid im Moment nicht verwendet
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        name:{type:'string',required:true,unique:true},
        email:{type:'email',required:true,unique:true},
        games:{collection:'game',via:'owner'},
        image:{type:'string'},
        provider:{type:'string'},
        identifier:{type:'string'},
        password:{type:'string'}

	},
    toJSON:function(){
       var obj =this.toObject();

        delete obj.password;
        delete obj.identifier;

        return obj;

    }

};
