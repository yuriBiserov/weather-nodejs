const chalk = require('chalk')

// the module that handles the http requests
const gotWrapper = require("./gotWrapper.js");

/*
   mapbox URL parts
*/
const mapboxUrlKey = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const jsonOutput = '.json'
// use your own key here.
const mapboxApiKey = '?access_token=pk.eyJ1IjoiaGFkYXNjIiwiYSI6ImNrcmR6anUxbDA3eWYybmxoc2F4cXdtNjkifQ.rhzN8Ftk5kdDxW_oJIE8Wg'
// get one result only - the best match found
const limitString = "&limit=1"

/**
 * This method is repsonsible for the HTTP call to the 
 * mapbox API
 *
 * @param {String} textToSearch input search from user
 * @return {*} the JSON element from the response that holds the cooordinates
 */
async function callMapboxAPI(textToSearch)
{
    // https://api.mapbox.com/geocoding/v5/mapbox.places/sde nahum.json?access_token=pk.eyJ1IjoiaGFkYXNjIiwiYSI6ImNrcmR6anUxbDA3eWYybmxoc2F4cXdtNjkifQ.rhzN8Ftk5kdDxW_oJIE8Wg&limit=1
    // compose the URL from predefined variables and dynamic input from user.
    const locatorURL = mapboxUrlKey + textToSearch + jsonOutput + mapboxApiKey + limitString;
    //console.log(locatorURL)
    // this operation initiates the http request to mapbox to retrieve 
    // the bast match location based on the search.
    let locator = await gotWrapper.makeRequest(locatorURL);
    // The request has finished successfully (if it wouldn't,
    // the try/catch in makeRequest() would catch the error 
    try {
        // Make sure the request returned any element in the
        // features array.
        // 
        // the URL defines limit=1, so we expect there will be 
        // at most one result
        if (locator.features.length > 0)
        {
            // get first (and only) element in features array,
            // which hold the location.
            return {place_name: locator.features[0].place_name,
                        coordinates: locator.features[0].center
                    }
        }
    } catch (err)
    {
        console.error(chalk.red.bgWhite('HTTP Request to Mapbox does not ' +
                      'contain an array with coordinates as expected.\n'+
                      'URL: ' + locatorURL + "\nError Message:\n"), err);
        process.exit(-1);
    }
}

// export the method that should be used in order to access
// the mapbox API from this program, for the purpose of finding
// locations through free text search.
module.exports = {
    callMapboxAPI: callMapboxAPI
}