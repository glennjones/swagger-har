'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Package = require('../package.json');

const internals = {};
const querystring = module.exports = {};


// schema for properties
querystring.schema = Joi.object({
    'name': Joi.string(),
    'value': Joi.string().empty(''),
    'comment': Joi.string().empty('')
}).unknown();


// defaults settings
querystring.defaults = {
    'name': '',
    'value': '',
    'comment': ''
}


querystring.convert = function (swaggerQueryStringObj, callback){

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

    Joi.assert(out, querystring.schema);
    if(callback){
        callback(null, out);
    }else{
       return out;
    }

}

