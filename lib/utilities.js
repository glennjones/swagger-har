const utilities = module.exports = {};

// TODO replace with version from Exemplar
utilities.getValue =function( type, property, settings){
    let out = settings.defaults[type];
    if(settings.useDefaults === true && property.default){
        out = property.default;
    }
    if(settings.useExamples === true && property.example){
        out = property.example;
    }
    // all values are set as strings
    return String(out);
};
