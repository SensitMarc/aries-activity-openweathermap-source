import test from 'blue-tape';
import fs from 'fs';
import nock from 'nock';
import OpenWeatherMapSource from '..';

function getTestConfig(env) {
    return { 
        appId: '123',
        q: 'Lexington, KY',
        dataPath: '/forecast',
        lat: '39.05',
        lon: '-84.66'
    };
}

// Test we have proper configuration.
test('proper configuration', t => {
    const activity = new OpenWeatherMapSource();
    t.equal(OpenWeatherMapSource.props.name, require('../package.json').name);
    t.equal(OpenWeatherMapSource.props.version, require('../package.json').version);
    t.end();
});

// Test api request.
test('api request', t => async function() {
    const activity = new OpenWeatherMapSource();
    const config = getTestConfig();

    // Intercept request.
    const scope = nock(OpenWeatherMapSource.uri)
        .get(OpenWeatherMapSource.path)
        .query(config)
        .replyWithFile(200, __dirname + '/weather.json');

    const result = await activity.request(config);
    t.ok(result);
}());

test('api request with forecast', async t => {
    const activity = new OpenWeatherMapSource();
    const config = getTestConfig();
    const response = activity.request(config);
    t.comment(response);
})

// Transform.
test('transform', t => {
    const activity = new OpenWeatherMapSource();
    const response = JSON.parse(fs.readFileSync(`${__dirname}/weather.json`));
    const doc = activity.transform(response);
    t.ok(doc.timestamp);
    t.end();
});

// Non-mocked, full-blown test. THIS HAS SIDE-EFFECTS.
// Typically skipped unless directly testing.
test.skip('onTask', t => async function() {
    const activity = new OpenWeatherMapSource();
    const config = getTestConfig();
    const key = await activity.onTask({}, config);
    t.comment(`Uploaded ${key}`);
    t.ok(key);
}());
