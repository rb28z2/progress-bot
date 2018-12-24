import jsonFile from "jsonfile";
let ioInstance;
let stats;

export function initIo(http) {
	ioInstance = require("socket.io")(http);
	return ioInstance;
}

export function io() {
	return ioInstance;
}

export var lastUpdated = new Date().toUTCString();
export var validCommands = ["encode", "tlc", "title", "episode", "time", "tl", "ts", "edit", "qc"];

export function getStats() {
	if (!stats){
		console.log("Reading existing data...".green);
		const file = `${__dirname}/data.json`;
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
}

export var file = `${__dirname}/data.json`;