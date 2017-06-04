var config = require('./config.js');
var fs = require('fs');

//below block is to init stuff. nothing special here
var irc = require("irc");
var colors = require("colors");

console.log("Initializing Express and HTTP stuff...".green);
var express = require('express');

const app = express();
app.use(express.static("assets")); //deliver content in the 'assets' folder

var http = require('http')
	.Server(app);

//configure in HTTPS mode
if (config.httpsMode)
{
	console.log("HTTPS Mode".yellow);
	http = require('https');
	http = http.createServer({
		key: fs.readFileSync(config.httpsKey),
		cert: fs.readFileSync(config.httpsCert)
	}, app);
}

console.log("Initializing Socket.io stuff...".green);
var io = require('socket.io')(http); //socket.io for realtime stuff


var jsonFile = require('jsonfile'); //because i'm lazy

console.log("Connecting to IRC...".green);
var bot = new irc.Client(config.server, config.botName,
{
	channels: config.channels
});
console.log("Connected!".yellow);

var encode = "encode",
	title = "title",
	tlc = "tlc",
	episode = "episode",
	time = "time",
	tl = "tl",
	ts = "ts",
	edit = "edit",
	qc = "qc";


var validCommands = ["encode", "tlc", "title", "episode", "time", "tl", "ts", "edit", "qc"]

//Read progress values from file
console.log("\nINIT COMPLETE\n".bold.magenta);
console.log("Reading existing data...".green);
var file = __dirname + "/data.json";
var stats = jsonFile.readFileSync(file);

console.log(colors.grey('%s\n'), JSON.stringify(stats));

/**var stats = {
	encode: file["encode"],
	title: file["title"],
	episode: file["episode"],
	time: file["time"],
	tl: file["tl"],
	ts: file["ts"],
	edit: file["edit"],
	qc: file["qc"]
};*/


console.log("Adding listener for trigger...".green);
/**
* Below block is for listening to a specific trigger word.
*/
var listener = "message"+config.listenChannel[0];
bot.addListener(listener, function(from, text, message)
{
	//extract the first n characters from each message and check if it matches the trigger word
	if (text.substring(0, config.trigger.length) === config.trigger)
	{
		var msg = text.substring(config.trigger.length);
		console.log("Message Received: ", msg);
		//if we have a matching trigger, extract the command the value
		var command = msg.substring(0, msg.indexOf(" "));
		var value = msg.substring(msg.indexOf(" ") + 1);


		if (validCommands.indexOf(command) != -1)
		{

			//Resets all progress on a new title update
			if (command === "title")
			{
				console.log("Resetting everything".yellow);
				for (var key in stats)
				{
					if (stats.hasOwnProperty(key))
					{
						stats[key] = 0;
						io.emit("update-stats", { "command": key, "value":0});
					}
				}
			}

			console.log("Valid command: ".yellow, command, value);
			stats[command] = value;
			if (command !== "title" && command !== "episode")
			{
				var toSay = "\u0002" + stats[title] + "\u0002 | Episode " + stats[episode] + " | " + capitalizeFirst(command) + " progress @ " + stats[command] + "\%";
				for (var i = 0; i < config.notifyChannel.length; i++)
				{
						bot.say(config.notifyChannel[i], toSay)
				}

			}
			else if (command === "episode") {
				var toSay = "Currently working on \u0002" + stats[title] + "\u0002 episode " + stats[episode];
				for (var i = 0; i < config.notifyChannel.length; i++)
				{
						bot.say(config.notifyChannel[i], toSay)
				}
			}
		}

		io.emit("update-stats", { "command": command, "value":value});

	}
});

bot.addListener("error", function(message)
{
	console.log("IRC Error ".red, message);
});


app.get('/', function(req, res)
{
	res.sendFile(__dirname + "/index.html");
});

app.get('/progressbar.min.js', function(req, res)
{
	res.sendFile(__dirname + "/progressbar.min.js");
});

io.on('connection', function(socket)
{
	console.log("Socket connection established. ID: ".grey, socket.id);
	socket.emit("irc message", "Connected!");

	//for each new client, update their stats (initial update)
	for (var i = 0; i < validCommands.length; i++)
	{
		var command = validCommands[i];
		//console.log(command);
		if (command !== "title" && command !== "episode")
		{
			socket.emit("init-stats", { "command": validCommands[i], "value": stats[validCommands[i]] / 100});
		}
		else {
			socket.emit("init-stats", { "command": validCommands[i], "value": stats[validCommands[i]]});
		}
	}

	io.emit("update-users", io.engine.clientsCount);

	socket.on('disconnect', function(socket)
	{
		io.emit("update-users", io.engine.clientsCount);
	});

});


if (config.httpsMode)
{
	http.listen(8443, function()
	{
		console.log("Listening on port %s in HTTPS mode".bold.yellow, config.httpsPort);
	});
}
else {
	http.listen(config.port, function()
	{
		console.log("Listening on port %s in HTTP mode".bold.yellow, config.port);
	});
}
//Below stuff is all for clean exits and for uncaught exception handling
process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, err)
{
	if (options.cleanup) console.log('clean'.red);
	if (err) console.log(err.stack);

	jsonFile.writeFileSync(file, stats);

	if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,
{
	cleanup: true
}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null,
{
	exit: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null,
{
	exit: true
}));

function capitalizeFirst(string)
{
	if (string.length > 3) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	else {
		return string.toUpperCase();
	}
}
