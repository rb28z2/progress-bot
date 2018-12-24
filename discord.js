// eslint-disable-next-line no-unused-vars
const colors = require("colors");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");

exports.initDiscord = function() {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}`.yellow);
	});

	client.on("message", msg => {
		if (msg.content === "ping") {
			msg.reply("pong");
		}
	});

	client.login(config.discordKey);
};