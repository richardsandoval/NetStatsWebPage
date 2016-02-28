/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: 'string',
            required: true,
            protected: true
        },
        status : {
            type : 'boolean',
            defaultsTo: false,
            required : true
        },
        sniffer : {
            collection : 'data',
            via : 'user'
        }
    },

    beforeUpdate: function (values, next) {
        CipherService.hashPassword(values);
        next();
    },
    beforeCreate: function (values, next) {
        CipherService.hashPassword(values);
        next();
    }


};

