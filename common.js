import jsonFile from "jsonfile";
import config from "./config.js";
let ioInstance;
let stats;

const encode = "encode";
const title = "title";
const tlc = "tlc";
const episode = "episode";
const time = "time";
const tl = "tl";
const ts = "ts";
const edit = "edit";
const qc = "qc";

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

export function triggerMatch(text) {
	return text.substring(0, config.trigger.length) === config.trigger;
}

export function getMsg(text) {
	return text.substring(config.trigger.length);
}

export function getCommand(msg) {
	return msg.substring(0, msg.indexOf(" "));
}

export function getValue(msg) {
	return msg.substring(msg.indexOf(" ") + 1);
}

export function newTitleTrigger(command, value) {
	const tempTitle = stats["title"];
	if (command === "title" || command === "episode") {
		console.log("Resetting everything".yellow);
		for (const key in stats) {
			if (stats.hasOwnProperty(key)) {
				stats[key] = 0;
				ioInstance.emit("update-stats", {
					"command": key,
					"value": 0
				});
			}
		}

		if (command === "episode") {
			stats["title"] = tempTitle;
			stats["episode"] = value;
			ioInstance.emit("update-stats", {
				"command": "title",
				"value": tempTitle
			}); 
		}
	}
	
}

export function getIRCtoSay(command) {
	if (command === "episode") {
		return `Currently working on \u0002${stats[title]}\u0002 episode ${stats[episode]}`;
	}
	else if (command !== "title") {
		return `\u0002${stats[title]}\u0002 | Episode ${stats[episode]} | ${capitalizeFirst(command)} progress @ ${stats[command]}%`;
	}
	else return null;
}

export function getDiscordtoSay(command) {
	if (command === "episode") {
		return `Currently working on **${stats[title]}** episode ${stats[episode]}`;
	}
	else if (command !== "title") {
		return `**${stats[title]}** | Episode ${stats[episode]} | ${capitalizeFirst(command)} progress @ ${stats[command]}%`;
	}
	else return null;
}

function capitalizeFirst(string) {
	if (string.length > 3) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	else {
		return string.toUpperCase();
	}
}