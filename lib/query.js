const Hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');
const Utilities = require('../lib/utilities.js');

const querystring = (module.exports = {});

// schema for properties
querystring.schema = Joi.object({
  name: Joi.string(),
  value: Joi.string().empty(''),
  comment: Joi.string().empty(''),
}).unknown();

// defaults settings
querystring.defaults = {
  name: '',
  value: '',
  comment: '',
};

querystring.convert = function(property, settings) {
  let out = Hoek.clone(this.defaults);
  out.name = property.name;
  out.value = Utilities.getValue(property.type, property, settings || {}).toString();
  if (property.description) {
    out.comment = property.description;
  }

  Joi.assert(out, querystring.schema);
  return out;
};
