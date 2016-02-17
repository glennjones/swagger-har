# swagger-har

## IN DEVELOPMENT - API NOT STABLE

This module converts [OpenAPI (aka Swagger)](https://openapis.org/) schemas object into an array of [HAR](http://hapijs.com/) request objects.

````bash
$ npm install swagger-har
```

``` javascript
const SwaggerHAR  = require('swagger-har');
const options = {};

SwaggerHAR.toRequests( json, options, function( err, requestArr ){
    // do something with requestArr
});

```

## Options
```json
const defaults = {
    'useExamples': true,
    'useDefaults': true,
    'defaults': {
        string: 'string',
        integer: '0',
        number: '0',
        boolean: 'true',
        file: 'filename.txt'
    },
    path: '/sum',
    method: 'get'
};
```



## Lab test
The project has integration and unit tests. To run the test within the project type one of the following commands.
```bash
$ lab
$ lab -r html -o coverage.html
$ lab -r html -o coverage.html --lint
$ lab -r console -o stdout -r html -o coverage.html --lint
```

## Issues
If you find any issue please file here on github and I will try and fix them.