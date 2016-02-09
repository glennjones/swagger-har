'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Request = require('../lib/request.js');
const Package = require('../package.json');

const internals = {};
const har = module.exports = {};


// schema for properties
har.schema = Joi.object({
    'log': Joi.object({
        'version': Joi.string(),
        'creator': Joi.object({
            'name': Joi.string(),
            'version': Joi.string()
        }),
        'browser': Joi.object(),
        'pages': Joi.array(),
        'entries': Joi.array(),
        'comment': Joi.string()
    })
}).unknown();


// defaults settings
har.defaults = {
    'log': {
        'version': '1.2',
        'creator': {
            'name': 'swagger-har',
            'version': Package.version
        },
        'pages': [],
        'entries': [],
        'comment': ''
    }
}


har.convert = function (swagger, callback){

    let out = Hoek.clone( this.defaults );
    let requestArr = [];

    const xUrl = swagger.schemes[0] + '://' + swagger.host + swagger.basePath;

    for (var pathSegment in swagger.paths) {
        let path = swagger.paths[pathSegment]

        for (var methodName in path) {
            //console.log(xUrl, pathSegment, methodName);
            let pathMethodObj = path[methodName];

            // add parent object naming into object as properties
            pathMethodObj['x-path-segment'] = pathSegment;
            pathMethodObj['x-method'] = methodName;
            pathMethodObj['x-url'] = xUrl;

            Request.convert(pathMethodObj, function(err, harRequest){
                //console.log(JSON.stringify(harRequest));
               // let now = new Date.toISOString();
                out.log.entries.push({
                    startedDateTime: '1970-01-01T00:00:00',
                    time: -1,
                    response: {},
                    cache: {},
                    timings: {},
                    request: harRequest
                });
                requestArr.push(harRequest)
            })

        }
    }


    //var out = (options.info) ? Hoek.applyToDefaults(info.defaults, options.info) : info.defaults;
    //Joi.assert(out, info.schema);

    callback(null, requestArr);
}

