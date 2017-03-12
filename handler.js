const fs=require("fs");

var Command = require( "./Classes/Command.js" );

class Handler {
	constructor( bot, options ) {
		this.bot=bot;
		
		this.dPrefix = options.dPrefix;
		this.obPrefix = options.obPrefix;
		this.gPrefixes = options.guildPrefixes;
		
		if ( !this.gPrefixes )
			this.gPrefixes = {};
		
		this.commands={};
		
		bot.on("messageCreate",(msg)=>{
			if ( !msg.guild ) return;
			var pr = this.dPrefix;
			
			if ( msg.guild.id in this.gPrefixes )
				pr = this.gPrefixes[ msg.guild.id ];
			
			if ( !msg.cleanContent.startsWith( pr ) && !msg.cleanContent.startsWith( this.obPrefix ) ) return;
			var args = msg.cleanContent.split(" ");
			
			for (let cmd in this.commands) {
				cmd=this.commands[cmd];
				if (typeof(cmd.payload)!="function")
					throw new Error(`Command payload for "${cmd.name}" isn't a function.`);
				
				if ( args[0] == pr + cmd.name || args[0] == this.obPrefix + cmd.name ) {
					if ( args[1] != undefined && args[1] != null ) {
						console.log( "args[1]" );
						for ( let sub in cmd.subcommands ) {
							sub = cmd.subcommands[ sub ];
							if ( sub.name == args[1] ) {
								console.log( "sub.name == args[1]" );
								var reply=sub.payload(msg,args);
								if (reply!=undefined&&reply!=null)
									bot.createMessage(msg.channel.id,reply);
								
								return;
							}
						}
					}
					
					var reply=cmd.payload(msg,args);
					if (reply!=undefined&&reply!=null)
						bot.createMessage(msg.channel.id,reply);
				}
			}
		});
	}
	
	register( name, payload, options ) {
		if (!name) throw new Error("No name for command.");
		if (!payload) throw new Error(`No payload for command "${name}".`);
		if (typeof(payload)!="function") throw new Error(`Command payload for "${name}" isn't a function.`);
		
		return this.commands[name] = new Command( name, payload, options );
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
	
	setDefaultPrefix( prefix ) {
		this.dPrefix = prefix;
		return this.prefix;
	}
	
	unsetDefaultPrefix() {
		this.dPrefix = undefined;
	}
	
	setObligatoryPrefix( prefix ) {
		this.obPrefix = prefix;
		return this.obPrefix;
	}
	
	unsetObligatoryPrefix() {
		this.obPrefix = undefined;
	}
	
	setGuildPrefix( guildId, prefix ) {
		this.gPrefixes[ guildId ] = prefix;
		return this.gPrefixes[ guildId ];
	}
	
	unsetGuildPrefix( guildId ) {
		if ( guildId in this.gPrefixes )
			delete this.gPrefixes[ guildId ];
	}
}

module.exports=Handler;