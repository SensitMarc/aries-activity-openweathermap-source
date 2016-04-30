import { Activity, singleS3StreamOutput } from 'aries-data';
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
    static path = '/data/2.5';

    @singleS3StreamOutput('json')
    async onTask(activityTask, config) {
        // Run query.
        const queryResponse = await this.requestForecast(config);

        // Add timestamp.
        // const document = this.transform(queryResponse);

        // Return the stringified document.
        return queryResponse;
    }

    async requestForecast(config) {
        // Create params.
        const params = {
            uri: OpenWeatherMapSource.uri + OpenWeatherMapSource.path + config.dataPath,
            qs: config,
            json: true,
        };

        // Run our query.
        const data = await request(params);
        return data.list;
    }

    // transform(doc) {
    //     return Object.assign(doc, { timestamp: new Date() });
    // }
};
