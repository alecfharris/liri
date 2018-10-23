// Setup Requirements
require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");

//Import Keys
var keys = require('./keys.js');

// Setup API Keys
var spotify = new Spotify(keys.spotify);

//Set up random.txt
var fs = require('fs');

// Establish User Input
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

// Set Up Command Functionality
output = function (command, input) {
    if (command === 'do-what-it-says') {
        //Read the file
        fs.readFile('random.txt', 'utf8', function (err, contents) {
            //Split the contents into an array
            var randomText = contents.split(" ");
            //Retrieve the Command
            command = randomText[0];
            //Retrieve the input
            input = randomText.slice(1).join(" ");
            //Run the search function again
            output(command, input);
        });
    }

    if (command === 'concert-this') {
        //Replace Invalid Inputs with Appropriate Text
        var input = input.replace(' ', '+');
        input = input.replace('/', '%252F');
        input = input.replace('?', '%253F');
        input = input.replace('*', '%252A');
        input = input.replace('"', '%27C');
        var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + keys.bandsInTown.api_key;

        request(queryUrl, function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode === 200) {
                // Post Concert Info
                for (i = 0; i < JSON.parse(body).length; i++) {
                    console.log('Venue: ' + JSON.parse(body)[i].venue.name);
                    console.log('Venue Location: ' + JSON.parse(body)[i].venue.city + ', '
                        + JSON.parse(body)[i].venue.region + " " + JSON.parse(body)[i].venue.country);
                    console.log('Date: ' + moment((JSON.parse(body)[i].datetime)).format("MM/DD/YY"));
                    console.log(" ")
                }
            }
        });
    }

    if (command === 'spotify-this-song') {
        // If Input is blank, select "The Sign" by Ace of Base
        if (input === '') {
            input = '"The Sign" ace of base';
        }
        spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // Ensure that all artists are listed if there are multiple artists
            var artists = new Array;
            for (i = 0; i < data.tracks.items[0].album.artists.length; i++) {
                artists.push(" " + data.tracks.items[0].album.artists[i].name);
            }

            // Log the retrieved data
            console.log('Artists:' + artists);
            console.log('Song Title: ' + data.tracks.items[0].name);
            console.log('Preview Link: ' + data.tracks.items[0].preview_url);
            console.log('Album: ' + data.tracks.items[0].album.name);
        });
    }

    // Set up movie commands
    if (command === 'movie-this') {
        var input = input.replace(" ", "+");
        if (input === '') {
            input = 'Mr+Nobody';
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=" + keys.omdb.api_key;

        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
                // Post Movie Info
                console.log('Title: ' + JSON.parse(body).Title)
                console.log('Release Year: ' + JSON.parse(body).Year);
                console.log('IMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
                console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                console.log('Production Country: ' + JSON.parse(body).Country);
                console.log('Language: ' + JSON.parse(body).Language);
                console.log('Plot: ' + JSON.parse(body).Plot);
                console.log('Actors: ' + JSON.parse(body).Actors);
            }
        });
    }
}

output(command, input);



