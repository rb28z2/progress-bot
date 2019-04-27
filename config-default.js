const config = {
	enableIrc: true,
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
	httpsKey: "/path/to/key.pem", //port, key, and cert not required in http mode
	httpsCert: "/path/to/cert.pem",
	trigger: "!pb ", //Word to trigger actions. IMPORTANT: INCLUDE A TRAILING SPACE
	identify: false, //Set to true to enable nickserv identification
	nick_secret: false, //set to a "" enclosed password if you dont want to enter it every time
	// else leave false to prompt for a password
	nickserv: "nickserv", //nick identification service's name
	
	
	enableDiscord: false,
	discordKey: "yourkeyhere", // your discord bot token
	discordNotifyChannels: ["0"], // comma separated numerical notify channel id
	discordListenChannels: ["0"]
};

export default config;
