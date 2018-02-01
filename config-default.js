var config = {
	/*
	List all channels the bot should join, include channel keys if required. 
	ex: ["#channelA", "#channelB channelB-password", "#anotherChannel"] 
	*/
	channels: ["#yourchannel"], 
	/*
	List of channels (a subset of 'channels') that the bot should listen for commands on.
	Note that everyone in that channel will be able to trigger commands.
	*/
	listenChannel: ["#yourchannel"],
	/*
	List of channels (a subset of 'channels') that the bot should announce updates on.
	Bot will NOT respond to trigger commands here.
	*/
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
