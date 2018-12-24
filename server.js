let config = require("./config.js");
let fs = require("fs");

//below block is to init stuff. nothing special here
let colors = require("colors");

console.log("Initializing Express and HTTP stuff...".green);
let express = require("express");

const app = express();
app.use(express.static("assets")); //deliver content in the 'assets' folder

let http = require("http")
	.Server(app);

let common = require("./common.js");
let stats = common.stats();


//configure in HTTPS mode
if (config.httpsMode) {
	console.log("HTTPS Mode".yellow);
	http = require("https");
	http = http.createServer({
		key: fs.readFileSync(config.httpsKey),
		cert: fs.readFileSync(config.httpsCert)
	}, app);
}

console.log("Initializing Socket.io stuff...".green);

var io = common.initIo(http); // socket.io for realtime stuff


let jsonFile = require("jsonfile"); //because i'm lazy

if (config.enableIrc) {
	let ircClient = require("./irc.js");
	ircClient.initIRC();
}

if (config.enableDiscord) {
	let discordClient = require("./discord.js");
	discordClient.initDiscord();
}

console.log("\nINIT COMPLETE\n".bold.magenta);

console.log(colors.grey("%s\n"), JSON.stringify(stats));


app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get("/progressbar.min.js", function (req, res) {
	res.sendFile(__dirname + "/progressbar.min.js");
});

io.on("connection", function (socket) {
	console.log("Socket connection established. ID: ".grey, socket.id);
	socket.emit("irc message", "Connected!");

	socket.emit("date-update", common.lastUpdated);

	

	//for each new client, update their stats (initial update)
	for (let i = 0; i < common.validCommands.length; i++) {
		let command = common.validCommands[i];
		//console.log(command);
		if (command !== "title" && command !== "episode") {
			socket.emit("init-stats", {
				"command": common.validCommands[i],
				"value": stats[common.validCommands[i]] / 100
			});
		}
		else {
			socket.emit("init-stats", {
				"command": common.validCommands[i],
				"value": stats[common.validCommands[i]]
			});
		}
	}

	io.emit("update-users", io.engine.clientsCount);

	socket.on("disconnect", function (socket) {
		io.emit("update-users", io.engine.clientsCount);
	});

});


if (config.httpsMode) {
	http.listen(8443, function () {
		console.log("Listening on port %s in HTTPS mode".bold.yellow, config.httpsPort);
	});
}
else {
	http.listen(config.port, function () {
		console.log("Listening on port %s in HTTP mode".bold.yellow, config.port);
	});
}
//Below stuff is all for clean exits and for uncaught exception handling
process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, err) {
	if (options.cleanup) console.log("clean".red);
	if (err) console.log(err.stack);

	jsonFile.writeFileSync(common.file, stats);
	console.log("Saving stats to disk".yellow);

	if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, {
	cleanup: true
}));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {
	exit: true
}));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, {
	exit: true
}));



