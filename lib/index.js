import { Activity, singleS3FileOutput } from 'astronomer-aries';
import request from 'request-promise';

/**
 * Activity to run a query on Open Weather Map.
 */
export default class OpenWeatherMapSource extends Activity {
    static props = {
        name: require('../package.json').name,
        version: require('../package.json').version,
    };

    static uri = 'http://api.openweathermap.org';
    static path = '/data/2.5/weather';

    @singleS3FileOutput()
    async onTask(activityTask, config) {
        // Run query.
        const queryResponse = await this.request(config);

        // Add timestamp.
        const document = this.transform(queryResponse);

        // Return the stringified document.
        return JSON.stringify(document);
    }

    async request(config) {
        // Create params.
        const params = {
            uri: OpenWeatherMapSource.uri + OpenWeatherMapSource.path,
            qs: config,
            json: true,
        };

        // Run our query.
        return await request(params);
    }

    transform(doc) {
        return Object.assign(doc, { timestamp: new Date() });
    }
};
