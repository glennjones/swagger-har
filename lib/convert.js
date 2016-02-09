'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const JSONDeRef = require('json-schema-ref-parser');
const HAR = require('../lib/har.js');
const HTTPSnippet = require('httpsnippet');

const internals = {};
const convert = module.exports = {};


// schema for properties
const schema = Joi.object({
    derefJSONSchema: Joi.boolean(),
}).unknown();


// defaults settings
const defaults = {
    'derefJSONSchema': true
}


convert.toRequests = function (json, callback) {
    var out = HAR.defaults;

    this.dereference(json, function (err, api) {

        if (!err) {
            //console.log(JSON.stringify(api))

            HAR.convert( api, function( err, har ){
                if(!err){
                    out = har;

                    /*
                    har.forEach(function(item){
                        console.log(JSON.stringify(item))
                        let snippet = new HTTPSnippet(item);
                        console.log(snippet.convert('node'));
                    })
                    */

                }
            });
        }
        callback(err, out);
    })
};


/**
 * dereference a JSON schema
 *
 * @param  {Object} schema
 * @param  {Object} callback
 */
convert.dereference = function (schema, callback) {

    JSONDeRef.dereference(schema, function (err, json) {

        if (!err) {
            delete json.definitions;
        } else {
            err = { 'error': 'fail to dereference schema', 'childError': err };
        }
        callback(err, json);
    });
};