# Liri

Liri is a Node.js program that will respond to certain commands by looking up either concerts, songs, or movies. It can also read a specific text file for a command and then run the command in that file. Once Liri has looked up the relevant information, it will output that information into the terminal and log it in a text file.

Liri can respond to the following commands:

* do-what-it-says
    * This will read the random.txt file for a command and then follow that command.
* spotify-this-song *song title*
    * This will have Liri look up the artist, song title, a preview link, and the album of the song in question using the Spotify API.
* movie-this *movie title*
    * This will have Liri look up the title, release year, IMDB and Rotten Tomatoes rating, production country, language, and a short plot summary of the specified movie.
* concert-this *band name*
    * This will have Liri look up all future scheduled concert venues, venue locations, and concert dates of the specified band. Note that this command will not return anything if the specified band does not have any future concerts listed on BandsInTown.

A video example of Liri in action can be found [here](https://youtu.be/tWTjSYzoLsQ).