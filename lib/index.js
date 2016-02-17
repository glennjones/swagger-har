'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const JSONDeRef = require('json-schema-ref-parser');
const Paths = require('../lib/paths.js');

const internals = {};
const index = module.exports = {};


// schema for properties
const schema = Joi.object({
    'useExamples': Joi.boolean(),
    'useDefaults': Joi.boolean(),
    'defaults': Joi.object({
        'string': Joi.string(),
        'integer': Joi.string(),
        'number': Joi.string(),
        'boolean': Joi.string(),
        'file': Joi.string()
    }).unknown(),
    'path': Joi.string().optional(),
    'method': Joi.string().optional()
}).unknown();


// defaults settings
const defaults = {
    'useExamples': true,
    'useDefaults': true,
    'defaults': {
        string: 'string',
        integer: '0',
        number: '0',
        boolean: 'true',
        file: 'filename.txt'
    }
};


index.toRequests = function (swagger, options, callback) {

    let out = [];
    let settings = Hoek.applyToDefaults(defaults, options);
    //Joi.assert(settings, index.schema);

    internals.dereference(swagger, function (err, api) {

        if (!err) {
            Paths.convert( api, settings, function( err, har ){

                if(!err){
                    out = har;
                }
            });
        }
        callback(err, out);
    });
};



/**
 * dereference a JSON schema
 *
 * @param  {Object} schema
 * @param  {Object} callback
 */
internals.dereference = function (schema, callback) {

    JSONDeRef.dereference(schema, function (err, json) {

        if (!err) {
            delete json.definitions;
        } else {
            err = { 'error': 'fail to dereference schema', 'childError': err };
        }
        callback(err, json);
    });
};