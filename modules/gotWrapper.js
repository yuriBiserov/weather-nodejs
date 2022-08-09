// Install the 'got' npm using the command:
// > npm install got
const got = require('got');
const chalk = require('chalk');

/**
 * Generic method for all necessary HTTP GET requests made 
 * by this application.
 * 
 *
 * @param {String} url The URL with the get request
 * @return {Object} The body of the response as JS element
 */
async function makeGetRequest(url)
{
    try {
//        // step 1 get and print raw data
       const response = await got(url);
//       console.log(response)

//        // step 2 parse to JSON the body
       const body_response = JSON.parse(response.body);
//       console.log(body_response)
        
        // step 3 - use json() to parse the body to JSON.
        // The json() method of the Response interface takes 
        // a Response, reads it and returns a promise which
        //  "resolves" with the result of parsing the body text as JSON.
        //const body_response = await got(url).json();
//        console.log(body_response)

        return body_response;

    } catch (err)
    {
        console.error(chalk.red.bgWhite('HTTP Request through got ' +
        'has failed.\n'+
        'URL: ' + url + "\nError Message:\n"), err);
        process.exit(-1);
    }
} 


module.exports = {
    makeRequest: makeGetRequest
}