'use strict';
const Utilities = require('../lib/Utilities.js');
const schema = module.exports = {};



schema.toJSON = function (schemaObj, settings) {
    return schema.toJSONFromObject(schemaObj, settings).properties;
};


schema.toJSONFromObject = function (schemaObj, settings) {

    for (let propertyName in schemaObj.properties) {
        let property = schemaObj.properties[propertyName];
        if (property.type) {

            switch (property.type) {
                case 'string':
                    schemaObj.properties[propertyName] = String( Utilities.getValue( 'string', property, settings ) );
                    break;
                case 'integer':
                    schemaObj.properties[propertyName] = parseInt( Utilities.getValue( 'integer', property, settings ), 10);
                    break;
                case 'number':
                    schemaObj.properties[propertyName] = parseFloat( Utilities.getValue( 'number', property, settings ) );
                    break;
                case 'boolean':
                    schemaObj.properties[propertyName] = new Boolean( Utilities.getValue( 'boolean', property, settings ) );
                    break;
                case 'file':
                    schemaObj.properties[propertyName] = String( Utilities.getValue( 'string', property, settings ) );
                    break;
                case 'object':
                    schemaObj.properties[propertyName] = schema.toJSONFromObject(schemaObj.properties[propertyName], settings);
                    break;
                case 'array':
                    schemaObj.properties[propertyName] = [schema.toJSONFromObject(schemaObj.properties[propertyName].items, settings).properties];
                    break;
            }
        }
    }
    return schemaObj;
};





