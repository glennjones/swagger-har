'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Exemplar = require('swagger-exemplar');
const Utilities = require('../lib/Utilities.js');

const internals = {};
const postdata = module.exports = {};


// schema for properties
postdata.schema = Joi.object({
    'mimeType': Joi.string(),
    'params': Joi.array().items(Joi.object({
        'name': Joi.string(),
        'value': Joi.string().empty(''),
        'fileName': Joi.string().empty(''),
        'contentType': Joi.string().empty(''),
        'comment': Joi.string().empty('')
    }).unknown()),
    'text': Joi.string().empty(''),
    'comment': Joi.string().empty('')
}).unknown();


// defaults settings
postdata.defaults = {
    'mimeType': '',
    'params': [],
    'text': '',
    'comment': ''
};


postdata.convertForm = function (properties, mimeType, settings, callback){

    let out = Hoek.clone( this.defaults );
    let textArray = [];
    out.mimeType = 'application/x-www-form-urlencoded';


    properties.forEach(function (property) {
        let param = {};
        param.name = property.name;
        param.value = Utilities.getValue( property.type, property, settings );
        if (property.description) {
            param.comment = property.description;
        }
        // build text pairing of name/value
        if(param.value !== undefined){
            textArray.push(param.name + '=' + param.value);
        }
        out.params.push(param);
    });

    out.text = textArray.join('&');


    if (callback) {
        callback(null, out);
    } else {
        return out;
    }
};



postdata.convertBody = function (swaggerPostObj, mimeType, settings){

    let out = Hoek.clone( postdata.defaults );
    out.mimeType = mimeType;

    const example = Exemplar.convert( swaggerPostObj.schema, settings );
    out.text = JSON.stringify(example);

    return out;
};

