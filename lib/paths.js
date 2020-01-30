const Hoek = require('@hapi/hoek');
const Request = require('../lib/request.js');

const paths = (module.exports = {});

paths.convert = async function(swagger, settings) {
  let requestArr = [];
  const xUrl = swagger.schemes[0] + '://' + swagger.host + swagger.basePath;

  for (var pathSegment in swagger.paths) {
    //console.log(pathSegment);

    if ((settings.path && settings.path === pathSegment) || !settings.path) {
      let path = swagger.paths[pathSegment];
      for (var methodName in path) {
        if ((settings.method && settings.method.toLowerCase() === methodName.toLowerCase()) || !settings.method) {
          //console.log(xUrl, pathSegment, methodName);
          let pathMethodObj = Hoek.clone(path[methodName]);

          // add parent object naming into object as properties
          pathMethodObj['x-path-segment'] = pathSegment;
          pathMethodObj['x-method'] = methodName;
          pathMethodObj['x-url'] = xUrl;

          const harRequest = Request.convert(pathMethodObj, settings)
          if(harRequest){
            requestArr.push(harRequest)
          }
        }
      }
    }
  }

  return requestArr;
};
