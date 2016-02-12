import { activity } from 'astronomer-aries';
import uuid from 'uuid';
import thenify from 'thenify-all';
import request from 'request-promise';
import AWS from 'aws-sdk';

/**
 * Activity to run a query on Open Weather Map.
 */
export default activity.props({
    config: {
        name: require('../package.json').name,
        version: require('../package.json').version,
    },
    uri: 'http://api.openweathermap.org',
    path: '/data/2.5/weather',
}).methods({
    async onTask(activityTask, config) {
        // Run query.
        const queryResponse = await this.request(config);

        // Add timestamp.
        const document = this.transform(queryResponse);

        // Create a filename.
        const key = uuid.v4();

        // Upload response to s3.
        const uploadResponse = await this.upload(key, document);
        this.log('Successfully uploaded weather data.');

        // Return the s3 key.
        return uploadResponse.key;
    },

    async request(config) {
        // Create params.
        const params = {
            uri: this.uri + this.path,
            qs: config,
            json: true,
        };

        // Run our query.
        return await request(params);
    },

    async upload(key, body) {
        // Create s3 service.
        const s3 = new AWS.S3({ region: 'us-east-1' });

        // Thenify s3.
        thenify(s3, s3, ['upload']);

        // Create upload params.
        const uploadParams = {
            Bucket: 'astronomer-workflows',
            Key: key,
            Body: JSON.stringify(body),
        };

        // Upload result.
        return await s3.upload(uploadParams);
    },

    transform(doc) {
        return Object.assign(doc, { timestamp: new Date() });
    },
});
