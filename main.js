const bot=require("./bot.js");
const Commands=require("./commands.js");

bot.on("ready",()=>{
	console.log(`[Bot] ${bot.user.username}#${bot.user.discriminator} is ready for use.`);
	
	bot.editStatus("online",{name:"with Alex"});
	
	Commands.loadcommands();
});

bot.connect();