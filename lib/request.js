'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const QueryString = require('../lib/querystring.js');
const Headers = require('../lib/headers.js');
const PostData = require('../lib/postdata.js');

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


request.convert = function (swaggerPathObj, callback){

    let out = Hoek.clone( this.defaults );
    out.method = swaggerPathObj['x-method'].toUpperCase();
    out.url = swaggerPathObj['x-url'] + swaggerPathObj['x-path-segment'];

    if(swaggerPathObj.description){
        out.comment = swaggerPathObj.description;
    }

    //var out = (options.info) ? Hoek.applyToDefaults(info.defaults, options.info) : info.defaults;
    //Joi.assert(out, info.schema);

    if (swaggerPathObj.parameters) {
        let formDataArray = [];
        let pathArray = [];

        swaggerPathObj.parameters.forEach(function (param) {
            switch (param.in) {
               case 'header':
                    out.headers.push( Headers.convert(param) );
                    break;
               case 'query':
                    out.queryString.push( QueryString.convert(param) );
                    break;
               case 'formData':
                    formDataArray.push(param);
                    break;
               case 'body':
                    out.postData = PostData.convertBody(param, 'application/json');
                    break;
               case 'path':
                    pathArray.push(param);
                    break;
            }
        })

        if (formDataArray.length > 0) {
            out.postData = PostData.convertForm(formDataArray, 'application/json');
        }
        out.url = request.urlWithValues(pathArray, out.url);

    }



    callback(null, out);
}


request.urlWithValues = function (pathArray, url){
    /*
    pathArray.forEach(function(pathObj){
        let value = (pathObj.example)? pathObj.example : null;
        if(pathObj.default){
            value = pathObj.default;
        }

        if(url.indexOf('{' + pathObj.name + '}') > -1 && value ){
            url = url.replace('{' + pathObj.name + '}', value)
        }
    });
    */

    return url;
}
