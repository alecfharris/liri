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
         //Log command
         fs.appendFile("log.txt", command + '\n', function(err) {
            if (err) {
              return console.log(err);
            }
          });
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
        var origInput = input;
        var input = input.replace(' ', '+');
        input = input.replace('/', '%252F');
        input = input.replace('?', '%253F');
        input = input.replace('*', '%252A');
        input = input.replace('"', '%27C');
        var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + keys.bandsInTown.api_key;

        request(queryUrl, function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode === 200) {
                //Log Command
                fs.appendFile("log.txt", command + " " + origInput + '\n', function(err) {
                    if (err) {
                      return console.log(err);
                    }
                  });
                // Post Concert Info
                for (i = 0; i < JSON.parse(body).length; i++) {

                    var textOutput = 'Venue: ' + JSON.parse(body)[i].venue.name + '\nVenue Location: ' + JSON.parse(body)[i].venue.city + ', '
                    + JSON.parse(body)[i].venue.region + " " + JSON.parse(body)[i].venue.country +
                    '\nDate: ' + moment((JSON.parse(body)[i].datetime)).format("MM/DD/YY") +'\n';

                    console.log(textOutput);

                    fs.appendFile("log.txt", textOutput + '\n', function(err) {
                        if (err) {
                          return console.log(err);
                        }
                      });
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

            var textOutput = 'Artists:' + artists + '\nSong Title: ' + data.tracks.items[0].name + 
            '\nPreview Link: ' + data.tracks.items[0].preview_url + '\nAlbum: ' + data.tracks.items[0].album.name;

            console.log(textOutput);

            fs.appendFile("log.txt", command + " " + input + '\n' + textOutput + '\n\n', function(err) {
                if (err) {
                  return console.log(err);
                }
              });
        });
    }

    // Set up movie commands
    if (command === 'movie-this') {
        var origInput = input;
        var input = input.replace(" ", "+");
        if (input === '') {
            input = 'Mr+Nobody';
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=" + keys.omdb.api_key;

        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
                // Post Movie Info
                var textOutput = 'Title: ' + JSON.parse(body).Title +
                '\nRelease Year: ' + JSON.parse(body).Year +
                '\nIMDB Rating: ' + JSON.parse(body).Ratings[0].Value +
                '\nRotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value +
                '\nProduction Country: ' + JSON.parse(body).Country +
                '\nLanguage: ' + JSON.parse(body).Language +
                '\nPlot: ' + JSON.parse(body).Plot +
                '\nActors: ' + JSON.parse(body).Actors;

                console.log(textOutput);

                fs.appendFile("log.txt", command + " " + origInput + '\n' + textOutput + '\n\n', function(err) {
                    if (err) {
                      return console.log(err);
                    }
                  });
            }
        });
    }
}

output(command, input);



