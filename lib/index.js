const Hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');
const JSONDeRef = require('json-schema-ref-parser');
const MayBe = require('call-me-maybe');
const Paths = require('../lib/paths.js');


// schema for properties
const schema = Joi.object({
    'useExamples': Joi.boolean(),
    'useDefaults': Joi.boolean(),
    'useEnum': Joi.boolean(),
    'defaults': Joi.object({
        'string': Joi.string(),
        'integer': Joi.string(),
        'number': Joi.string(),
        'boolean': Joi.string(),
        'file': Joi.string(),
        'int32': Joi.string(),
        'int64': Joi.string(),
        'float': Joi.string(),
        'double': Joi.string(),
        'byte': Joi.string().empty(''),
        'binary': Joi.string().empty(''),
        'date': Joi.string(),
        'date-time': Joi.string(),
        'password': Joi.string()
    }).unknown(),
    'path': Joi.string().optional(),
    'method': Joi.string().optional()
}).unknown();


// defaults settings
const defaults = {
    'useExamples': true,
    'useDefaults': true,
    'useEnum': true,
    'defaults': {
        'string': 'string',
        'integer': '0',
        'number': '0',
        'boolean': 'true',
        'file': 'filename.txt',
        'int32': '0',
        'int64': '0',
        'float': '0.0',
        'double': '0',
        'byte': '',
        'binary': '',
        'date': '2016-01-01',
        'date-time': '2016-01-01T00:00:00Z',
        'password': '********'
    }
};


module.exports = {

    toRequests: async function (swagger, options, callback) {

        let settings = Hoek.applyToDefaults(defaults, options || {});
        //Joi.assert(settings, schema);

        //console.log(settings)

        try {
            const har = await Paths.convert( swagger, settings );
            return MayBe(callback, Promise.resolve(har));
        }
        catch (err) {
            return MayBe(callback, Promise.reject(err));
        }
    }

}

/**
     * dereference a JSON schema
     *
     * @param  {Object} schema
     */
dereference = async function (schema) {

    let json = await JSONDeRef.dereference(schema);
    if (!err) {
        delete json.definitions;
        return json;
    } else {
        const err = { 'error': 'fail to dereference schema', 'childError': err };
        return err;
    }
};

