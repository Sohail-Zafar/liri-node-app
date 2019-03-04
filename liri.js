// Assignment: Liri
// File: liri.js
// Programer: Sohail Zafar
// This program is called Liri. Liri stands for Language Interpretation and Recognition Interface.
// This program uses Node.js. It takes command line arguments to search the web for information and returns data.


// Load required files and set up global varibles
require("dotenv").config();
var keys = require("./keys.js");

var axios = require('axios');
var Spotify = require('node-spotify-api'); 

var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var inputArgument = process.argv[2];
var inputData = process.argv.slice(3).join(" ");
var dataResults;

// Executes decide() function
decide();

// Function decide(). This function selects which functions for Liri to execute based on command line argument.
function decide() {
  switch (inputArgument) {

    case 'concert-this':
      bandsInTown();
      break;
    
    case 'spotify-this-song':
      spotifyMusicSearch(); 
      break;

    case 'movie-this':
      movieSearch();
      break;
    
    case 'do-what-it-says':
      doWhatItSays();
      break;
  }
}

// Function Moive Search. This function searches for moive data.
// displays data to the console.
function movieSearch(){
var movieName = inputData;

if (!movieName) {
  movieName = "Mr. Nobody";
}

axios
  .get(
    'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy'
  )
  .then(function(response) {
    dataResults = 
    "\n" +
    "-----------------------------------------------------------------------------------------------\n" +
    "Movie name is: " + movieName + "\n" +
    "The Movie Year: " + response.data.Year + "\n" +
    "The movie's rating is: " + response.data.imdbRating + "\n" +
    "Rotten Tomatoes Rating of the movie: " + response.data.tomatoRotten + "\n" +
    "Country where moive was produced: "+ response.data.Country + "\n" +
    "Language of the movie: " + response.data.Language + "\n" +
    "Plot of the movie: " + response.data.Plot + "\n" +
    "Actors in the movie: " + response.data.Actors + "\n";

    console.log(dataResults);
    logFile();
  })};

  // Function Spotify track Music Search. Searches Spotify npm for track information 
  //  data displayed to console.
  function spotifyMusicSearch() {
  
    if (!inputData) {
    inputData = "The Sign";
  }
  
  spotify
   .search({ type: 'track', query: inputData })
   .then(function(response) {
    
      var dataTrack = response.tracks.items;
      
      for (var i = 0; i < dataTrack.length; i++) {
          dataResults =
          "\n" +
          "---------------------------------------------------------------------------------------\n" +
          "Artist name: " + dataTrack[i].artists[0].name +"\n" +
          "Song name: " + dataTrack[i].name + "\n" +
          "Preview Link: " + dataTrack[i].preview_url + "\n" +
          "Album name: " + dataTrack[i].album.name + "\n" ;

          console.log(dataResults);
          logFile();
        }   
      });
    }
  
  // Function searches the bands in town API for up coming list of concerts for given artists.
  // displays data to console.
  function bandsInTown() {
  var bandName = inputData;
  axios
  .get(
  "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp" )
  .then(function(response){ 
    console.log("bandsInTown: " + bandName);
    dataResults = response.data;
    console.log(response.data);
    logFile();
  });
}

// Function Do what it Says. Reads random.txt file and executs command arguments.
function  doWhatItSays(){
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    var dataArray = data.split(",");
    console.log(dataArray[0]);
    console.log(dataArray[1]);

    inputArgument = dataArray[0];
    inputData = dataArray[1];
    decide(); 
  });
}

// Function logFile. This function log the search results to the log.txt file.
function logFile() {
  fs.appendFile("log.txt", dataResults, function(err) {

    if (err) {
      console.log(err);
    }
  });
}