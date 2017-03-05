let Token=require("./bot.json").token;

const Eris=require("eris"),
	bot=new Eris.Client(Token)

const CommandHandler=require("./commands/handler.js"),
	Commands=new CommandHandler(bot,"a.")

Commands.register("ping",(msg,args)=>{
	console.log( "Ping" );
	return `**Pong!** ${msg.channel.guild.shard.latency}ms`;
});

bot.on("ready",()=>{
	console.log(`[Bot] ${bot.user.username}#${bot.user.discriminator} is ready for use.`);
	
	bot.editStatus("online",{name:"with Alex"});
});

bot.connect();