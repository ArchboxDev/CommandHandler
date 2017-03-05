let Token=require("./bot.json").token;

const Eris=require("eris"),
	bot=new Eris.Client(Token)

bot.on("ready",()=>{
	console.log(`${bot.user.username}#${bot.user.discriminator} is ready for use.`);
	bot.editStatus("online",{name:"with Alex"});
});

bot.connect();
