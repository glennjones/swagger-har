const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const SwaggerHar = require('../lib/index.js');
const SwaggerExample = require('../swagger-examples/01.json');

const expect = Code.expect;
const lab = exports.lab = Lab.script();


lab.experiment('SwaggerHar - ', () => {

    lab.test('config file has correct value', async () => {
        const har = await SwaggerHar.toRequests(SwaggerExample);
        expect(har.toString()).to.contain('something');
    });

});