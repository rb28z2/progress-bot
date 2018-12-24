
var config = require("./config.js");
var jsonFile = require("jsonfile");
var io;
var stats;

exports.initIo = function(http) {
	io = require("socket.io")(http);
	return io;
};

exports.io = function() {
	return io;
};

exports.lastUpdated = new Date().toUTCString();

exports.validCommands =	["encode", "tlc", "title", "episode", "time", "tl", "ts", "edit", "qc"];

exports.stats = function() {
	if (!stats){
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
	}
	return stats;
};

exports.file = __dirname + "/data.json";