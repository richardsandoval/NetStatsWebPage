/**
 * Sniffer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        istcp: {
            type: 'boolean'
        },
        smac: {
            type: 'string'
        },
        dmac: {
            type: 'string'
        },
        sip: {
            type: 'string'
        },
        dip: {
            type: 'string'
        },
        flags: {
            type: 'array'
        },
        protocol: {
            type: 'integer'
        },
        length: {
            type: 'integer',
            defaultsTo: 64
        },
        sudp: {
            type: 'integer'
        },
        dudp: {
            type: 'integer'
        },
        stcp: {
            type: 'integer'
        },
        dtcp: {
            type: 'integer'
        },
        payload: {
            type: 'string',
            protected: true
        },
        host: {
            type: 'string'
        },
        user: {
            model: 'user',
            protected: true
        }
    }
};

