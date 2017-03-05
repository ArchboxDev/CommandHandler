const Commands=require("../commands.js");

Commands.register("ping","goes pong",(msg,args)=>{
	return `**Pong!** ${msg.channel.guild.shard.latency}ms`;
});