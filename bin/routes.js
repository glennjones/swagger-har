'use strict';
const SwaggerHAR = require('../lib/index.js');
const SwaggerExample = require('../swagger-examples/01.json');


module.exports = [{
    method: 'GET',
    path: '/all',
    config: {
        handler: function (request, reply) {

            let options = {};

            SwaggerHAR.toRequests(SwaggerExample, options, function (err, hars) {
                reply(hars).type('application/json; charset=utf-8');
            });

        }
    }
}, {
    method: 'GET',
    path: '/single',
    config: {
        handler: function (request, reply) {

            let options = {
                path: 'store/',
                method: 'get'
            };

            SwaggerHAR.toRequests(SwaggerExample, options, function (err, hars) {
                reply(hars).type('application/json; charset=utf-8');
            });

        }
    }
}, {
    method: 'GET',
    path: '/novalues',
    config: {
        handler: function (request, reply) {

            let options = {
                'useExamples': false,
                'useDefaults': false
            };

            SwaggerHAR.toRequests(SwaggerExample, options, function (err, hars) {
                reply(hars).type('application/json; charset=utf-8');
            });

        }
    }
}, {
    method: 'GET',
    path: '/customvalues',
    config: {
        handler: function (request, reply) {

            let options = {
                'defaults': {
                    string: 'galaxy',
                    integer: '42',
                    number: '42.0',
                    boolean: 'false'
                }
            };

            SwaggerHAR.toRequests(SwaggerExample, options, function (err, hars) {
                reply(hars).type('application/json; charset=utf-8');
            });

        }
    }
}];
