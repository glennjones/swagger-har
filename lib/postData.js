'use strict';
const Hoek = require('hoek');
const Joi = require('joi');
const Package = require('../package.json');

const internals = {};
const postdata = module.exports = {};


// schema for properties
postdata.schema = Joi.object({
    'mimeType': Joi.string(),
    'params': Joi.array().items(Joi.object({
        'name': Joi.string(),
        'value': Joi.string(),
        'fileName': Joi.string(),
        'contentType': Joi.string(),
        'comment': Joi.string()
    }).unknown()),
    'text': Joi.string(),
    'comment': Joi.string()
}).unknown();


// defaults settings
postdata.defaults = {
    'mimeType': '',
    'params': [],
    'text': '',
    'comment': ''
}


postdata.convertForm = function (swaggerPostObjArr, mimeType, callback){

    let out = Hoek.clone( this.defaults );
    let textArray = [];
    out.mimeType = 'application/x-www-form-urlencoded';


    swaggerPostObjArr.forEach(function (swaggerPostObj) {
        let param = {};
        param.name = swaggerPostObj.name;

        if (swaggerPostObj.example) {
            param.value = swaggerPostObj.example.toString();
        }

        if (swaggerPostObj.default) {
            param.value = swaggerPostObj.default.toString();
        }

        if(param.value){
            textArray.push(param.name + "=" + param.value);
        }

        out.params.push(param);
    })

    out.text = textArray.join('&');



    //Joi.assert(out, postdata.schema);
    if (callback) {
        callback(null, out);
    } else {
        return out;
    }

}



postdata.convertBody = function (swaggerPostObj, mimeType, callback){

    let out = Hoek.clone( this.defaults );
    out.mimeType = mimeType;

    let json = postdata.schemaToObject(swaggerPostObj.schema, null);
    out.text = JSON.stringify(json);

   // Joi.assert(out, postdata.schema);
    if (callback) {
        callback(null, out);
    } else {
        return out;
    }

}


postdata.schemaToObject = function (schema, out) {
    if (schema.type === 'object') {
        out = {}
        if (schema.properties) {

            for (var itemName in schema.properties) {
                let item = schema.properties[itemName];

                // needs array and object recursion
                switch (item.type) {
                    case 'string':
                        out[itemName] = '';
                        break;
                    case 'number':
                        out[itemName] = '0';
                        break;
                    case 'boolean':
                        out[itemName] = 'true';
                        break;

                }

            }
        }
    }
    return out;

};
