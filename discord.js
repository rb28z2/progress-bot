// eslint-disable-next-line no-unused-vars
import colors from "colors";

import Discord from "discord.js";
const client = new Discord.Client();
import config from "./config.js";
import { io as _io, triggerMatch, getMsg, getCommand, getValue, validCommands, newTitleTrigger, getStats, getDiscordtoSay, getIRCtoSay } from "./common.js";
import { ircSay } from "./irc.js";

const stats = getStats();
const io = _io();


export function initDiscord() {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}`.yellow);
	});

	let lastUpdated = exports.lastUpdated;

	client.on("message", msg => {
		if (triggerMatch(msg.content)) {
			const message = getMsg(msg.content);
			const command = getCommand(message);
			const value = getValue(message);

			if (validCommands.includes(command)) {
				newTitleTrigger(command, value);
				console.log("Valid command: ".yellow, command, value);
				stats[command] = value;
				
				let discordMessage = getDiscordtoSay(command);
				let ircMessage = getIRCtoSay(command);
				discordSay(discordMessage);
				ircSay(ircMessage);


				io.emit("update-stats", {
					"command": command,
					"value": value
				});
				lastUpdated = new Date().toUTCString();
				io.emit("date-update", lastUpdated);
			}
		}
	});

	client.login(config.discordKey);
}

export function discordSay(message) {
	config.discordNotifyChannels.forEach(value => {
		let channel = client.channels.get(value);
		channel.send(message);
	});
}