const Commands=require("../commands.js");

Commands.register("help","bot credits and command list",(msg,args)=>{
	let returnstring="**__Alex's Bot__**\nCreated by **xAlex#7881** with help from **Bubbie#7294** and **AlexFlipnote#0021**.\n\n**Commands:**";
	
	for (let cmd in Commands.commands) {
		cmd=Commands.commands[cmd];
		returnstring+=`\n${cmd.name} - ${cmd.description}`;
	}
	
	return returnstring;
});

Commands.register("source","bot source on github",(msg,args)=>{
	return "**__Bot source__**\ngithub.com/xAlex-B/alexs-bot";
});