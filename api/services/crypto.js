'use strict';
/**
 * Created by Jonas Kugelmann on 25.04.2014.
 * Service für die Verschlüsselung von Passwörtern - wird noch nicht verwendet
 * Soll beim User auth verwendet werden
 */
var bcrypt = require('bcryptjs')
    ,Q=require('q');

module.exports ={
  generate: function(options,input){
    var saltComplexity = options.saltComplexity || 10;
    return Q.invoke(bcrypt,"genSalt",saltComplexity)
          .then(function(salt){
            return Q.invoke(bcrypt,'hash',input,salt);
        });
  },
  compare:function(input,hash){
      return Q.invoke(bcrypt,"compare",input,hash);
  }

};