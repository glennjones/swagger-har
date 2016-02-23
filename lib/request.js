'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Query = require('../lib/query.js');
const Headers = require('../lib/headers.js');
const Form = require('../lib/form.js');
const Utilities = require('../lib/Utilities.js');

const internals = {};
const request = module.exports = {};


// schema for properties
request.schema = Joi.object({
    'method': Joi.string().allow('GET', 'POST', 'PULL', 'DELETE', 'OPTION'),
    'url': Joi.string().uri(),
    'httpVersion': Joi.string().allow('HTTP/1.1','HTTP/2'),
    'headersSize': Joi.number(),
    'bodySize': Joi.number(),
    'cookies': Joi.array(),
    'headers': Joi.array(),
    'queryString': Joi.array(),
    'postData': Joi.object(),
    'comment': Joi.string()
}).unknown();


// defaults settings
request.defaults = {
    'method': 'GET',
    'url': 'http://www.example.com/',
    'httpVersion': 'HTTP/1.1',
    'headersSize': -1,
    'bodySize': -1,
    'cookies': [],
    'headers': [],
    'queryString': [],
    'comment': ''
}


request.convert = function (swaggerPathObj, settings, callback){

    let out = Hoek.clone( this.defaults );
    out.method = swaggerPathObj['x-method'].toUpperCase();
    out.url = swaggerPathObj['x-url'] + swaggerPathObj['x-path-segment'];

    if(swaggerPathObj.description){
        out.comment = swaggerPathObj.description;
    }


    if (swaggerPathObj.parameters) {
        let formDataArray = [];
        let pathArray = [];

        swaggerPathObj.parameters.forEach(function (param) {
            switch (param.in) {
               case 'header':
                    out.headers.push( Headers.convert(param, settings) );
                    break;
               case 'query':
                    out.queryString.push( Query.convert(param, settings) );
                    break;
               case 'formData':
                    formDataArray.push(param);
                    break;
               case 'body':
                    out.postData = Form.convertBody(param, 'application/json', settings);
                    break;
               case 'path':
                    pathArray.push(param);
                    break;
            }
        })

        if (formDataArray.length > 0) {
            out.postData = Form.convertForm(formDataArray, 'application/json', settings);
        }
        out.url = request.urlWithValues(pathArray, out.url, settings);

    }



    callback(null, out);
}


request.urlWithValues = function (pathArray, url, settings){

    pathArray.forEach(function(property){
        let value = Utilities.getValue( property.type, property, settings );

        if(url.indexOf('{' + property.name + '}') > -1 && value ){
            url = url.replace('{' + property.name + '}', value);
        }
    });
    return url;
}
