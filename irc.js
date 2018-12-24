import irc from "irc";
import config from "./config.js";
import { io as _io, getStats, validCommands} from "./common.js";

const io = _io();
const stats = getStats();

export function initIRC() {
	const encode = "encode";
	const title = "title";
	const tlc = "tlc";
	const episode = "episode";
	const time = "time";
	const tl = "tl";
	const ts = "ts";
	const edit = "edit";
	const qc = "qc";

	console.log("Connecting to IRC...".green);
	const bot = new irc.Client(config.server, config.botName, {
		channels: config.channels
	});
	console.log("Connected!".yellow);

	authorize();

	let lastUpdated = exports.lastUpdated;

	const listener = `message${config.listenChannel[0]}`;

	console.log("Adding listener for trigger...".green);
	/**
	 * Below block is for listening to a specific trigger word.
	 */
	bot.addListener(listener, (from, text, message) => {
		//extract the first n characters from each message and check if it matches the trigger word
		if (text.substring(0, config.trigger.length) === config.trigger) {
			const msg = text.substring(config.trigger.length);
			console.log("Message Received: ", msg);
			//if we have a matching trigger, extract the command the value
			const command = msg.substring(0, msg.indexOf(" "));
			const value = msg.substring(msg.indexOf(" ") + 1);
	
	
			if (validCommands.includes(command)) {
	
				//Resets all progress on a new title update
				if (command === "title" || command === "episode") {
					console.log("Resetting everything".yellow);
					const tempTitle = stats["title"];
					for (const key in stats) {
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
					let toSay = `\u0002${stats[title]}\u0002 | Episode ${stats[episode]} | ${capitalizeFirst(command)} progress @ ${stats[command]}%`;
					for (let i = 0; i < config.notifyChannel.length; i++) {
						bot.say(config.notifyChannel[i], toSay);
					}
	
				}
				else if (command === "episode") {
					let toSay = `Currently working on \u0002${stats[title]}\u0002 episode ${stats[episode]}`;
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

	bot.addListener("error", message => {
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
				bot.say(config.nickserv, `identify ${password}`);
			}
			else {
				console.log("Prompting for password".yellow);
				let pass_prompt = require("password-prompt");
				let password = await pass_prompt("ENTER PASSWORD AT ANY TIME");
				bot.say(config.nickserv, `identify ${password}`);
			}
			console.log("Identified".green); //todo: check if identify was successful
		}
	}
}