let keys = require("./keys.js");
let keysListTwitter = keys.twitterKeys;
let keysListSpotify = keys.spotifyKeys;
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');
let inquirer = require("inquirer");
let moment = require("moment");
let colors = require('colors');
let fs = require("fs");
let otherInfo = process.argv[3];

runCommand(process.argv[2]);

function runCommand(command) {
    if (command === 'my-tweets') {
        getTweets();
    } else if (command === 'spotify-this-song') {
        getSongs(otherInfo);
    } else if (command === 'movie-this') {
        getMovies(otherInfo);
    } else if (command === 'do-what-it-says') {
        getWhatever();
    } else if (command === 'inquirer') {
        console.log("Here's a short survey for you!");
        inquirer.prompt([{
        type: "input",
        message: "Whats your name?",
        name: "username"
    }, {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
    }, {
        type: "password",
        message: "Set your password",
        name: "password"
    }, {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
    }, {
        type: "list",
        message: "What do you want to do?",
        choices: ["spotify-this-song", "movie-this", "do-what-it-says"],
        name: "choice"
    }, {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
    }])
    .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
        	console.log("It is " + moment().format("MMM Do YYYY, hh:mm:ss a").bgMagenta);
            console.log("\nHello ".magenta + inquirerResponse.username);
            console.log("type 'npm ".magenta + inquirerResponse.choice + " and your request to make LIRI get it for you!\n".magenta);
        } else {
            console.log("\nThat's okay " + inquirerResponse.username + ", come again when you are more sure.\n".magenta);
        }
    });
    } else {
        console.log("|========= Error! =========|");
    }
}


// My Tweets
function getTweets() {
    console.log('Leenbeen90 tweeted: ');

    let params = {
        screen_name: 'leenbeen90',
        count: 20
    }

    let client = new Twitter({
        consumer_key: keysListTwitter.consumer_key,
        consumer_secret: keysListTwitter.consumer_secret,
        access_token_key: keysListTwitter.access_token_key,
        access_token_secret: keysListTwitter.access_token_secret
    });

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    	console.log("It is " + moment().format("MMM Do YYYY, hh:mm:ss a").bgCyan);
        console.log(tweets[0].created_at.red);
        console.log(tweets[0].text.red);
        if (error) {
            console.log('|========== Error! ==========|');
        }
    });
    append('my-tweets');
}

function getSongs() {
    if (otherInfo !== undefined) {
        let songName = otherInfo;
        console.log(songName);

        let spotify = new Spotify({
            id: '6e720aa9ce9044038f0263cb0c6698bb',
            secret: '2fbce965603c419eb153b71df7006026'
        });

        spotify.search({
            type: 'track',
            query: songName,
            limit: 1
        }, function(err, data) {
            if (err) {
                return console.log(err);
                console.log('|========== Error! ==========|');
            }
            console.log("It is ".blue + moment().format("MMM Do YYYY, hh:mm:ss a").bgYellow);
            console.log('Artists: '.blue, data.tracks.items[0].album.artists[0].name);
            console.log('Name: '.blue, data.tracks.items[0].album.name);
            console.log('Preview Link: '.blue, data.tracks.items[0].album.preview_url);
            console.log('Album: '.blue, data.tracks.items[0].album.name);
        });

    } else {
        console.log('What song are you looking for?'.blue);
    }
    append('spotify-this-song');
}

function getMovies() {
    if (otherInfo !== undefined) {
        let movieName = otherInfo;
        let queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
        request(queryURL, function(error, response, body) {
            // If the request was successful...
            if (!error && response.statusCode === 200) {
            	console.log("It is ".yellow + moment().format("MMM Do YYYY, hh:mm:ss a").bgBlue);
                console.log('Title: '.yellow, JSON.parse(body).Title);
                console.log('Release year: '.yellow, JSON.parse(body).Year);
                console.log('Rating: '.yellow, JSON.parse(body).Ratings[0].Value);
                console.log('Country: '.yellow, JSON.parse(body).Country);
                console.log('Language: '.yellow, JSON.parse(body).Language);
                console.log('Plot: '.yellow, JSON.parse(body).Plot);
                console.log('Actors: '.yellow, JSON.parse(body).Actors);
                console.log('Rotten Tomatoes URL: '.yellow);
            } else {
                console.log('|========== Error! ==========|')
            }
        });


    } else {
        let movieName = 'Mr. Nobody';
        let queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
        request(queryURL, function(error, response, body) {
            // If success
            if (!error && response.statusCode === 200) {
            	console.log("It is ".green + moment().format("MMM Do YYYY, hh:mm:ss a").bgRed);
                console.log('Title: '.green, JSON.parse(body).Title);
                console.log('Release year: '.green, JSON.parse(body).Year);
                console.log('Rating: '.green, JSON.parse(body).Ratings[0].Value);
                console.log('Country: '.green, JSON.parse(body).Country);
                console.log('Language: '.green, JSON.parse(body).Language);
                console.log('Plot: '.green, JSON.parse(body).Plot);
                console.log('Actors: '.green, JSON.parse(body).Actors);
                console.log('Rotten Tomatoes URL: '.green, 'Umm...?'.green);
            } else {
                // if error
                console.log('|========== Error! ==========|');
            }
        });
    }
    append('movie-this');
}

function getWhatever() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("It is ".cyan + moment().format("MMM Do YYYY, hh:mm:ss a").bgGreen);
        console.log(data);
        let dataArr = data.split(',');
        console.log(dataArr);
        otherInfo = dataArr[1];
        runCommand(dataArr[0]);
    });
    append('do-what-it-says');
}

function append(argv) {
    fs.appendFile('log.txt', argv + ', ', function(error) {
        if (error) {
            return console.log(err);
        } else {
            console.log("|======= Content Added! =======|".rainbow);
        }
    });
}
