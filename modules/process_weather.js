const gotWrapper = require("./gotWrapper.js");

/*
   openWeatherMap URL parts
*/
const weatherUrlKey = 'https://api.openweathermap.org/data/2.5/onecall'
// use your own key here
const weatherApiKey = '&appid=41fc55e3ac63c8efb5d8eac6707eaeaf';
// We wish to see the results in metric units 
// (Celsius and not Fahrenheit,
//  Kilometers and not Miles)
const weatherApiUnits = '&units=metric';

const exclude = '&exclude=minutely,hourly,alerts'

/**
 * Asyncronous method that syncs the order of execution of
 * the HTTP requests needed in order to get current weather data.
 * The first one is to get the coordinates
 * The second one is for the weather data
 * 
 *  @param {number} selection 0 - current weather
 *                            1 - 1 day forecast
 *                            anything else - 5 days forecast
 * 
 */ 
 async function getForecast(selection, coordinates)
 {
     // compose all parts of url
     // the same URL will send back one response for ALL forecast types.
     const url = weatherUrlKey +
                 '?lat='+coordinates[1]+
                 '&lon='+coordinates[0]+
                 weatherApiKey+
                 weatherApiUnits+
                 exclude
     // send the HTTP request to the URL
     const weatherData = await gotWrapper.makeRequest(url);
     // 0 = current weather data 
     if(selection===0)
     {
         return getCurrWeatherStr(weatherData.current);
     }
     // 1 = today's weather forecast 
     else if (selection===1)
     {
         return printDailyWeather(weatherData.daily[0]);
     }
     // 5 - 5 days weather forecast 
     else {
         let forecastStr = "";
         // call the printDailyWeather() method 5 times
         for (let index = 0; index < 5; index++) {
            forecastStr += "----\n" + 
                printDailyWeather(weatherData.daily[index]) + "\n";
         }
         return forecastStr
             
     }
 
 }
 
 /**
  * This method returns the weather string from the HTTP response
  * for Current weather ..
  * 
  * @param {Object} weatherInstance the object from response that holds the
  *                                 weather data
  * @return {String} Current weather information. 
  */
 function getCurrWeatherStr(weatherInstance)
 {
     try
     {
         return "Current weather is: " + weatherInstance.weather[0].main + ", " + weatherInstance.weather[0].description + '\n'
         + "Temperasture: " + weatherInstance.temp + '\n'
         + "Humidity: " + weatherInstance.humidity; 
     } catch(error)
     {
        return chalk.red.bgWhite("Something went wrong. Cannot process current weather forecast. \n") + err;
     }
 }
 
 /**
  * This method returns the weather string from the HTTP response
  * for daily forecast
  * 
  * @param {Object} weatherInstance the object from response that holds the
  *                                 weather data
  * @return {String} daily weather information. 
  */
 function printDailyWeather(weatherInstance)
 {
     try
     {
         // dt = the number of seconds that have elapsed since January 1, 1970
         return "For: " + new Date(weatherInstance.dt*1000).toLocaleDateString()+"\n" + 
           "Weather is  : " + weatherInstance.weather[0].main + ", " + weatherInstance.weather[0].description + '\n'
         + "Temperasture: Min: " + weatherInstance.temp.min + "\n" +
           "              Max: " + weatherInstance.temp.max + "\n"
         + "Humidity    : " + weatherInstance.humidity; 
     } catch(error)
     {
        return chalk.red.bgWhite("Something went wrong. Cannot process daily weather forecast. \n") + err;
     }
 }

 module.exports = {
    getForecast : getForecast
 }
 