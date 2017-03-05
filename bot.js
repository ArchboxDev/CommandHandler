let Token=require("./bot.json").token;

const Eris=require("eris");

var bot=new Eris.Client(Token);
var botuser;

bot.on("ready",()=>
{
	botuser=bot.user;
	console.log(`${botuser.username}#${botuser.discriminator} is ready for use.`);
	bot.editStatus("online",{name:"with Alex"});
}
);

bot.connect();