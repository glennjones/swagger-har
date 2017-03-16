'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Utilities = require('../lib/Utilities.js');

const internals = {};
const headers = module.exports = {};


// schema for properties
headers.schema = Joi.object({
    'name': Joi.string(),
    'value': Joi.string().empty(''),
    'comment': Joi.string().empty('')
}).unknown();


// defaults settings
headers.defaults = {
    'name': '',
    'value': '',
    'comment': ''
};


headers.convert = function (property, settings, callback){

    let out = Hoek.clone(this.defaults);
    out.name = property.name;
    out.value = Utilities.getValue(property.type, property, settings).toString();
    if (property.description) {
        out.comment = property.description;
    }

    Joi.assert(out, headers.schema);
    if (callback) {
        callback(null, out);
    } else {
        return out;
    }
};