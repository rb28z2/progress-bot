import irc from "irc";
import config from "./config.js";
import { io as _io, getStats, validCommands, getCommand, getValue, triggerMatch, getMsg, newTitleTrigger, getIRCtoSay, getDiscordtoSay} from "./common.js";
import { discordSay } from "./discord.js";

const io = _io();
const stats = getStats();
let bot;

export function initIRC() {
	console.log("Connecting to IRC...".green);
	bot = new irc.Client(config.server, config.botName, {
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
		if (triggerMatch(text)) {
			const msg = getMsg(text);
			console.log("Message Received: ", msg);
			//if we have a matching trigger, extract the command the value
			const command = getCommand(msg);
			const value = getValue(msg);
	
	
			if (validCommands.includes(command)) {
	
				newTitleTrigger(command, value);
				console.log("Valid command: ".yellow, command, value);
				stats[command] = value;
				
				let ircMessage = getIRCtoSay(command);
				let discordMessage = getDiscordtoSay(command);
				
				if (config.enableDiscord && discordMessage) ircSay(ircMessage);
				if (config.enableIrc && ircMessage) discordSay(discordMessage);
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

export function ircSay(message) {
	if (message){
		for (let i = 0; i < config.notifyChannel.length; i++) {
			bot.say(config.notifyChannel[i], message);
		}
	}
}