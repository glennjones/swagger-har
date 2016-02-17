'use strict';
const Hoek = require('hoek');
const Request = require('../lib/request.js');

const internals = {};
const paths = module.exports = {};


paths.convert = function (swagger, settings, callback) {

    let requestArr = [];
    const xUrl = swagger.schemes[0] + '://' + swagger.host + swagger.basePath;


    for (var pathSegment in swagger.paths) {
        //console.log(pathSegment);

        if (settings.path && settings.path === pathSegment || !settings.path) {
            let path = swagger.paths[pathSegment];
            for (var methodName in path) {

                if (settings.method &&
                    settings.method.toLowerCase() === methodName.toLowerCase() ||
                    !settings.method) {

                    //console.log(xUrl, pathSegment, methodName);
                    let pathMethodObj = Hoek.clone( path[methodName] );

                    // add parent object naming into object as properties
                    pathMethodObj['x-path-segment'] = pathSegment;
                    pathMethodObj['x-method'] = methodName;
                    pathMethodObj['x-url'] = xUrl;

                    Request.convert(pathMethodObj, settings, function (err, harRequest) {
                        requestArr.push(harRequest);
                    });
                }

            }
        }
    }

    callback(null, requestArr);
};

