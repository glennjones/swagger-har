'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp');
const Routes = require('../bin/routes.js');


let server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3006
});


server.register([
    Inert,
    Vision,
    Blipp], (err) => {

        server.route(Routes);

        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });