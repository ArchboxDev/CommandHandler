const Commands=require("../commands.js");

Commands.register("ping",(msg,args)=>{
	return `**Pong!** ${msg.channel.guild.shard.latency}ms`;
});