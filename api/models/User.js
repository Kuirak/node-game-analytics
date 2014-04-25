"use strict";
/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
