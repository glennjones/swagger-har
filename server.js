const SwaggerHar = require('./lib/index.js');
const SwaggerExample = require('./swagger-examples/01.json');

(async () => {
  const har = await SwaggerHar.toRequests(SwaggerExample);
  console.log(JSON.stringify(har));
  return har
})();
