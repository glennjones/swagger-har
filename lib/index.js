'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const JSONDeRef = require('json-schema-ref-parser');
const Paths = require('../lib/paths.js');

const internals = {};
const index = module.exports = {};


// schema for properties
internals.schema = Joi.object({
    'useExamples': Joi.boolean(),
    'useDefaults': Joi.boolean(),
    'useEnum': Joi.boolean(),
    'defaults': Joi.object({
        'string': Joi.string(),
        'integer': Joi.string(),
        'number': Joi.string(),
        'boolean': Joi.string(),
        'file': Joi.string(),
        'int32': Joi.string(),
        'int64': Joi.string(),
        'float': Joi.string(),
        'double': Joi.string(),
        'byte': Joi.string().empty(''),
        'binary': Joi.string().empty(''),
        'date': Joi.string(),
        'date-time': Joi.string(),
        'password': Joi.string()
    }).unknown(),
    'path': Joi.string().optional(),
    'method': Joi.string().optional()
}).unknown();


// defaults settings
internals.defaults = {
    'useExamples': true,
    'useDefaults': true,
    'useEnum': true,
    'defaults': {
        'string': 'string',
        'integer': '0',
        'number': '0',
        'boolean': 'true',
        'file': 'filename.txt',
        'int32': '0',
        'int64': '0',
        'float': '0.0',
        'double': '0',
        'byte': '',
        'binary': '',
        'date': '2016-01-01',
        'date-time': '2016-01-01T00:00:00Z',
        'password': '********'
    }
};


index.toRequests = function (swagger, options, callback) {

    let out = [];
    let settings = Hoek.applyToDefaults(internals.defaults, options);
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