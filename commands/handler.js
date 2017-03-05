const fs=require("fs");

class Command {
	constructor(name,description,payload){
		this.name=name;
		this.description=description;
		this.payload=payload;
	}
}

class Handler {
	constructor(bot,prefix){
		this.bot=bot;
		this.prefix=prefix;
		
		this.commands={};
		
		bot.on("messageCreate",(msg)=>{
			if (!msg.cleanContent.startsWith(this.prefix)) return;
			var args = msg.cleanContent.split(" ");
			
			for (let cmd in this.commands) {
				cmd=this.commands[cmd];
				if (typeof(cmd.payload)!="function")
					throw new Error(`Command payload for "${cmd.name}" isn't a function.`);
				
				if (args[0]==this.prefix+cmd.name){
					let reply=cmd.payload(msg,args);
					if (reply!=undefined&&reply!=null)
						bot.createMessage(msg.channel.id,reply);
				}
			}
		});
	}
	
	register(name,description,payload){
		if (!name) throw new Error("No name for command.");
		if (!payload) throw new Error(`No payload for command "${name}".`);
		if (typeof(payload)!="function") throw new Error(`Command payload for "${name}" isn't a function.`);
		
		return this.commands[name]=new Command(name,description,payload);
	}
	
	unregister(name){
		if (!name) throw new Error("No name for command.");
		if (!this.commands[name]) throw new Error(`Command "${name}" doesn't exist.`);
		
		delete this.commands[name];
	}
	
	loadcommands(){
		var files=fs.readdirSync("./cmds");
		for (let file of files){
			require(`../cmds/${file}`);
		}
	}
	
	reloadcommands(){
		var files=fs.readdirSync("./cmds");
		for (let file of files){
			delete require.cache[ require.resolve( `../cmds/${file}` ) ];
			require(`../cmds/${file}`);
		}
	}
}

module.exports=Handler;