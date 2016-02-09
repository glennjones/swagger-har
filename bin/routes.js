const Convert = require('../lib/convert.js');
const SwaggerExample = require('../swagger-examples/01.json');


module.exports = [
    {
        method: 'GET',
        path: '/convert',
        config: {
            handler: function (request, reply) {

                Convert.toRequests(SwaggerExample, function (err, api) {
                    renderJSON(request, reply, err, api)
                })

            },
        }
    }
];

// render json out to http stream
function renderJSON( request, reply, error, result ){
	if(error){
		if( utils.isString( error ) ){
			reply( utils.buildError( 400, error ) );
		}else{
			reply( error );
		}
	}else{
		reply(result).type('application/json; charset=utf-8');
	}
}