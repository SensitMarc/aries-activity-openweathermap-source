import test from 'blue-tape';
import fs from 'fs';
import nock from 'nock';
import openWeatherMap from '..';

function getTestConfig() {
    return { appId: 'efa17477a7e8b2723afdbee014ae0fba', q: 'Lexington, KY' };
}

// Test we have proper configuration.
test('proper configuration', t => {
    const activity = openWeatherMap();
    t.equal(activity.config.name, require('../package.json').name);
    t.equal(activity.config.version, require('../package.json').version);
    t.end();
});

// Test api request.
test('api request', t => async function() {
    const activity = openWeatherMap();
    const config = getTestConfig();

    // Intercept request.
    const scope = nock(activity.uri)
        .get(activity.path)
        .query(config)
        .replyWithFile(200, __dirname + '/weather.json');

    const result = await activity.request(config);
    t.ok(result);
}());

// Test s3 upload.
test('s3 upload', t => async function() {
    const activity = openWeatherMap();

    const key = '12345';
    const body = { 'weather': 'data' };

    // Intercept request.
    const scope = nock('https://astronomer-workflows.s3.amazonaws.com')
        .put(`/${key}`)
        .reply(200);

    const response = await activity.upload(key, body);
    t.equal(response.key, key);
}());

// Transform.
test('transform', t => {
    const activity = openWeatherMap();
    const response = JSON.parse(fs.readFileSync(`${__dirname}/weather.json`));
    const doc = activity.transform(response);
    t.ok(doc.timestamp);
    t.end();
});

// Non-mocked, full-blown test. THIS HAS SIDE-EFFECTS.
// Typically skipped unless directly testing.
test.only('onTask', t => async function() {
    const activity = openWeatherMap();
    const config = getTestConfig();
    const key = await activity.onTask({}, config);
    t.comment(`Uploaded ${key}`);
    t.ok(key);
}());
