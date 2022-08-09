/*
  This is the main application module.
  It is the skeleton of the application and runs until stopped.
*/

const chalk = require('chalk');

// import app's sub modules
const process_location = require("./modules/process_location.js")
const process_weather = require("./modules/process_weather.js")

// readline is the interface for reading/writing to different kinds
// of inputs/outputs.
// in this case we use it with stdin/stdout (from/to terminal)
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Import utils to use promisify() on readline
// make the question() method a promise so we could use async/await
// it originally uses a callback mechansim
const util = require('util');
const question = util.promisify(rl.question).bind(rl);

getInputFromUser();

// we must wrap the main loop in an async function as there are 
// async method calls
async function getInputFromUser()
{
    // writing the code in a try/catch allows catching errors before they
    // stop the code unexpectedly.
    try {
        console.log("Weather app: ")
        
        /*
         * Main loop
         * This is the main application loop that will keep prompting the user 
         * to get more forecasts for different locations.
         * The program will never end until we type q.
         */
        while (true)
        {
            // forecastType is a variable that will indicate to the weather
            // module which type of forecast/information the user is
            // interested in.
            // 0 - current weather
            // 1 - today's forecast
            // 5 - 5 days 
            let forecastType = 0;

            
            // The coordinates will be extracted from the location that the
            // user will enter
            let coordinates;
            
            /*
             * Loop for the first question
             * As the input is unexpected, we should enable as many attempts
             * as needed to get the right answer.
             * The boolean variable inputValid will tell the loop wheather 
             * a good input was provided or not.
             */ 
            let inputValid = false;
            
            // This while loop will only break when
            // the user input for the first question is valid
            while(!inputValid)
            {
                // Prompt the user to select the kind of weather
                // information to show:
                let answer1 = await question(
                    "Please select weather forecast type:\n"+
                "    c for current\n" +
                "    t for today's forecast\n" +
                "    5 for 5 days forecast\n" +
                "    (q to quit)\n\n");

                // examine the output using switch
                switch(answer1)
                {
                    case 'c':
                    case 'C':
                        console.log("See current weather data");
                        inputValid = true;
                        break; // Exit the switch, the input is valid
                    case 't':
                    case 'T':
                        console.log("Selected today's forecast")
                        forecastType = 1;
                        inputValid = true;
                        break; // Exit the switch, the input is valid
                    case '5':
                        console.log("Selected 5 days forecast")
                        forecastType = 5;
                        inputValid = true;
                        break; // Exit the switch, the input is valid
                    case "q":
                    case "Q":
                        console.log("Good Bye...")
                        process.exit(0);
                        break;
                    default:
                        console.log("Answer is invalid. Try again. ")
                }
            }
            
            // Forecast type was selected successfuly (previous step)

            /*
             * Loop for the 2nd question
             * it will prompt the user to enter location to get the forecast 
             * for. if the location was not found, or not what the user
             * intended, it will prompt the user to re-enter.
             */
            while (true)
            {
                // Prompt the user to enter location
                let answer2 = await question('Please enter address below: ');

                // Search the user's answer in mapbox API.
                let location = await process_location.callMapboxAPI(answer2);

                // if no result was found the user should try a different 
                // search text
                if (location === undefined)
                {
                    console.log('No results were found. Try a different search');
                } else {
                    // Result was found. Now the user should confirm
                    // it is what they intended for
                    let answer3 = await question("Found :\n" + 
                                                  location.place_name + "\n"+
                                                 "is this OK? (click 'n' for No): ");
                    // Check if the user did not select 'no' (which means it is the location they intended)
                    if (answer3 !== 'n' && 
                        answer3 !== 'N' &&
                        answer3.toLowerCase() !== 'no')
                    {
                            coordinates =  location.coordinates;
                            break; // break the loop, we have a location
                    }
                }
            }
            
            // at this point we have a forecast selection and location.
            // print the weather
            console.log("\n------------------------------------------------\n" +
               await process_weather.getForecast(forecastType, coordinates) +
               "\n------------------------------------------------");
        } 
    } catch (err)
    {
        console.error(chalk.red.bgWhite("Something went wrong: \n"), err);
        process.exit(-1);
    }
}


