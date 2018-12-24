// eslint-disable-next-line no-unused-vars
import colors from "colors";

import Discord from "discord.js";
const client = new Discord.Client();
import config from "./config.js";

export function initDiscord() {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}`.yellow);
	});

	client.on("message", msg => {
		if (msg.content === "ping") {
			msg.reply("pong");
		}
	});

	client.login(config.discordKey);
}