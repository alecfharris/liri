// Setup Requirements
require("dotenv").config();
var Spotify = require("node-spotify-api");
require("request");
require("moment");

//Import Keys
var keys = require('./keys.js')

// Setup API Keys
var spotify = new Spotify(keys.spotify)

// Establish User Input
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

// Set Up Command Functionality
if(command === 'spotify-this-song'){
    // If Input is blank, select "The Sign" by Ace of Base
    if (input === ''){
        input = '"The Sign" ace of base';
    }
    spotify.search({type: 'track', query: input, limit: 1}, function(err, data){
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // Ensure that all artists are listed if there are multiple artists
        var artists = new Array;
        for(i=0; i < data.tracks.items[0].album.artists.length; i++){
            artists.push(" " + data.tracks.items[0].album.artists[i].name);
            }

        // Log the retrieved data
        console.log('Artists:' + artists);
        console.log('Song Title: ' + data.tracks.items[0].name);
        console.log('Preview Link: ' + data.tracks.items[0].preview_url);
        console.log('Album: ' + data.tracks.items[0].album.name);
    });
}
