![alt text](/img/logo.png "Aries Integration for OpenWeatherMap")

#Aries Integration for OpenWeatherMap

This is an integration for [OpenWeatherMap](http://openweathermap.org).

##Methods
This integration uses two methods:

###1) Request Forecast
`requestForecast` - Returns the weather data for the next 5 days in 3 hour intervals. This is the finest resolution currently available.

###2) Request CurrentWeather
`requestCurrentWeather` - Returns a snapshot of the current weather at the time the integration is run.


##Configuration

###Method
The method denotes which of the above methods you want to use. Possible values are `forecast` or `current`
```javascript
"method": "requestCurrentWeather"
```

###App Id
The app Id is assigned to your account by OpenWeatherMap. You can find it by logging into your account, clicking 'API Keys' and either selecting a current API Key or creating a new one. It will be a 32 character string of letters (lowercase) and numbers.
```javascript
"appid": "6f14cc12f0db7ab876bedaf26zz98ne5"
```

###Data Path
The data path corresponds to the method. If using the `current` method, the datapath is `/weather`. If using the "forecast" method, the datapath is `/data`.
```javascript
"datapath": "/weather"
```

###Location
There are three location parameters that can be passed in.
1) q denotes a city and country formatting, separated by a comma and using ISO 3166 country codes.
2) id denotes a unique city id. The complete list can be found [here](http://bulk.openweathermap.org/sample/)
3) lat/lon denote latitude/longitude positioning respectively.
```
"q": "london, uk
OR
"id": "2172797"
OR
"lat": "139",
"lon": "35"
```

##Reponse
This is an example response when a query is made using the "current" method.
```javascript
{
    "coord": {
        "lon": -84.5,
        "lat": 38.03
    },
    "weather": [{
        "id": 600,
        "main": "Snow",
        "description": "light snow",
        "icon": "13d"
    }, {
        "id": 721,
        "main": "Haze",
        "description": "haze",
        "icon": "50d"
    }],
    "base": "stations",
    "main": {
        "temp": 264.49,
        "pressure": 1016,
        "humidity": 78,
        "temp_min": 264.15,
        "temp_max": 265.15
    },
    "visibility": 3219,
    "wind": {
        "speed": 3.1,
        "deg": 260
    },
    "clouds": {
        "all": 90
    },
    "dt": 1455111300,
    "sys": {
        "type": 1,
        "id": 1138,
        "message": 0.0291,
        "country": "US",
        "sunrise": 1455107614,
        "sunset": 1455145883
    },
    "id": 4301702,
    "name": "Mount Vernon",
    "cod": 200
}
```

##To Dos
- [ ] Add Support for XML Responses.
- [ ] Add Support for 16 Day Forecasting Endpoint.
- [ ] Add Support for Historical Data Endpoing.
- [ ] Eliminate Data Path as a config parameter.