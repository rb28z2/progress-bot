var irc = require("irc");
var config = require("./config.js");
var jsonFile = require("jsonfile");
var io;
var stats;

exports.io = function(http) {
	io = require("socket.io")(http);
	return io;
};

exports.lastUpdated = new Date().toUTCString();

exports.validCommands =	["encode", "tlc", "title", "episode", "time", "tl", "ts", "edit", "qc"];

exports.initIRC = function() {
	
	var encode = "encode",
		title = "title",
		tlc = "tlc",
		episode = "episode",
		time = "time",
		tl = "tl",
		ts = "ts",
		edit = "edit",
		qc = "qc";
	
	console.log("Connecting to IRC...".green);
	var bot = new irc.Client(config.server, config.botName, {
		channels: config.channels
	});
	console.log("Connected!".yellow);

	let lastUpdated = exports.lastUpdated;

	var listener = "message" + config.listenChannel[0];

	console.log("Adding listener for trigger...".green);
	/**
	 * Below block is for listening to a specific trigger word.
	 */
	bot.addListener(listener, function (from, text, message) {
		//extract the first n characters from each message and check if it matches the trigger word
		if (text.substring(0, config.trigger.length) === config.trigger) {
			var msg = text.substring(config.trigger.length);
			console.log("Message Received: ", msg);
			//if we have a matching trigger, extract the command the value
			var command = msg.substring(0, msg.indexOf(" "));
			var value = msg.substring(msg.indexOf(" ") + 1);
	
	
			if (exports.validCommands.indexOf(command) != -1) {
	
				//Resets all progress on a new title update
				if (command === "title" || command === "episode") {
					console.log("Resetting everything".yellow);
					var tempTitle = stats["title"];
					for (var key in stats) {
						if (stats.hasOwnProperty(key)) {
							stats[key] = 0;
							io.emit("update-stats", {
								"command": key,
								"value": 0
							});
						}
					}
					if (command === "episode") {
						stats["title"] = tempTitle;
						stats["episode"] = value;
						io.emit("update-stats", {
							"command": "title",
							"value": tempTitle
						});
	
					}
				}
	
				console.log("Valid command: ".yellow, command, value);
				stats[command] = value;
				if (command !== "title" && command !== "episode") {
					let toSay = "\u0002" + stats[title] + "\u0002 | Episode " + stats[episode] + " | " + capitalizeFirst(command) + " progress @ " + stats[command] + "%";
					for (let i = 0; i < config.notifyChannel.length; i++) {
						bot.say(config.notifyChannel[i], toSay);
					}
	
				}
				else if (command === "episode") {
					let toSay = "Currently working on \u0002" + stats[title] + "\u0002 episode " + stats[episode];
					for (let i = 0; i < config.notifyChannel.length; i++) {
						bot.say(config.notifyChannel[i], toSay);
					}
				}
			}
	
			io.emit("update-stats", {
				"command": command,
				"value": value
			});
			lastUpdated = new Date().toUTCString();
			io.emit("date-update", lastUpdated);
	
		}
	});
	
	bot.addListener("error", function (message) {
		console.log("IRC Error ".red, message);
	});

	function capitalizeFirst(string) {
		if (string.length > 3) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		else {
			return string.toUpperCase();
		}
	}

	async function authorize() {
		if (config.identify) {
			console.log("Identify nick enabled".yellow);
			if (config.nick_secret) {
				console.log("Password found".green);
				let password = config.nick_secret;
				bot.say(config.nickserv, "identify " + password);
			}
			else {
				console.log("Prompting for password".yellow);
				let pass_prompt = require("password-prompt");
				let password = await pass_prompt("ENTER PASSWORD AT ANY TIME");
				bot.say(config.nickserv, "identify " + password);
			}
			console.log("Identified".green); //todo: check if identify was successful
		}
	}
};



exports.stats = function() {
	console.log("Reading existing data...".green);
	var file = __dirname + "/data.json";
	try {
		stats = jsonFile.readFileSync(file);
	}
	catch (err) {
		if (err.code === "ENOENT") {
			//If no data file was found, start with dummy data
			console.log("No default data file found".yellow);
			console.log("Creating dummy data".yellow);
			stats = {
				"encode": 0,
				"title": "Another show",
				"episode": "5/12",
				"time": "20",
				"tl": "50",
				"ts": 0,
				"edit": "50",
				"qc": "60",
				"tlc": "20"
			};
		}
	}

	return stats;
};

exports.file = __dirname + "/data.json";