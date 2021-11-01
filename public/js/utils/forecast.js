const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=1d30868dbff166b5d49e7134bd514ba6&query=${latitude},${longitude}`
    request({ url, json:true }, (error, {body}) => {
        if (error) {
            callback('Unable to reach weather server', undefined)
        } else {
            const data = {
                temperature: body.current.temperature,
                temperatureFeel: body.current.feelslike
            }
            callback(undefined, data);
        }
    })
}

module.exports = forecast