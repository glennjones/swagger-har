'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Package = require('../package.json');

const internals = {};
const headers = module.exports = {};


// schema for properties
headers.schema = Joi.object({
    'name': Joi.string(),
    'value': Joi.string(),
    'comment': Joi.string()
}).unknown();


// defaults settings
headers.defaults = {
    'name': '',
    'value': '',
    'comment': ''
}


headers.convert = function (swaggerQueryStringObj, callback){

    let out = Hoek.clone( this.defaults );
    out.name = swaggerQueryStringObj.name;

    if(swaggerQueryStringObj.example){
        out.value = swaggerQueryStringObj.example.toString();
    }

    if(swaggerQueryStringObj.default){
        out.value = swaggerQueryStringObj.default.toString();
    }

    if(swaggerQueryStringObj.description){
        out.comment = swaggerQueryStringObj.description;
    }

    Joi.assert(out, headers.schema);
    if(callback){
        callback(null, out);
    }else{
       return out;
    }
}
