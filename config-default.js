var config = {
	channels: ["#yourchannel"],
	listenChannel: ["#yourchannel"],
	notifyChannel: ["#yourchannel"],
	server: "irc.server.here",
	botName: "progressBot",
  port: 80,
	httpsMode: false, //enables https only mode
	httpsPort: 8443,
	httpsKey: '/path/to/key.pem', //port, key, and cert not required in http mode
	httpsCert: '/path/to/cert.pem',
  trigger: "!pb " //Word to trigger actions. IMPORTANT: INCLUDE A TRAILING SPACE
};

module.exports = config;
