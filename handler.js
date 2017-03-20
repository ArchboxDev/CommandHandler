const fs=require("fs");

var Command = require( "./Classes/Command.js" );

class Handler {
	constructor( bot, options ) {
		this.bot=bot;
		
		this.dPrefix = options.dPrefix;
		this.obPrefix = options.obPrefix;
		this.gPrefixes = options.guildPrefixes;
		
		this.cmdusage = 0;
		
		if ( !this.gPrefixes )
			this.gPrefixes = {};
		
		this.commands={};
		
		bot.on("messageCreate",(msg)=>{
			if ( msg.author.bot ) return;
			if ( !msg.guild.IsPrivate() && !msg.channel.permissionsOf( bot.user.id ).json.sendMessages ) return;
			
			var pr = this.dPrefix;
			
			if ( msg.guild.id in this.gPrefixes )
				pr = this.gPrefixes[ msg.guild.id ];
			
			if ( !msg.content.startsWith( pr ) && !msg.content.startsWith( `${bot.user.mention}` ) ) return;
			
			var rawargs = msg.content.split( " " );
			var args = msg.content.replace( rawargs[0], "" ).match( /"(?:\\"|\\\\|[^"])*"|\S+/gm );
			
			args = args || []; // FUCK YOU // thanks for the shortcut randon
			
			if ( rawargs[0] == `${bot.user.mention}` ) {
				rawargs[0] = `${bot.user.mention} ${args[0]}`;
				delete rawargs[1];
				for ( let i in rawargs ) {
					if ( i != 0 ) {
						rawargs[i-1] = rawargs[i];
						delete rawargs[i];
					}
				}
			}

			for (let cmd in this.commands) {
				cmd=this.commands[cmd];
				if (typeof(cmd.payload)!="function")
					throw new Error(`Command payload for "${cmd.name}" isn't a function.`);
				for ( let cmdname of cmd.names ) {
					if ( rawargs[0] == pr + cmdname || rawargs[0] == `${bot.user.mention} ${cmdname}` ) {
						if ( rawargs[1] != undefined && rawargs[1] != null ) {
							for ( let sub in cmd.subcommands ) {
								sub = cmd.subcommands[ sub ];
								for ( let subname of sub.names ) {
									if ( subname == rawargs[1] ) {
										this.cmdusage += 1;
										if ( bot.privateChannels.get( msg.guild.id ) ) {
											console.log( `DM: ${msg.author.id}: ${msg.author.username}#${msg.author.discriminator}: ${msg.cleanContent}` );
										} else {
											console.log( `${msg.guild.name}: ${msg.channel.name}: ${msg.author.username}#${msg.author.discriminator}: ${msg.cleanContent}` );
										}
										
										delete args[0];
										for ( let i in args ) {
											if ( i != 0 ) {
												args[i-1] = args[i];
												delete args[i];
											}
										}
										
										var qs = "";
										for ( let s in args ) {
											if ( s == 0 ) {
												qs += args[ s ];
											} else {
												qs += " " + args[ s ];
											}
										}
										
										var reply=sub.payload(msg,args,qs);
										if (reply!=undefined&&reply!=null) {
											bot.createMessage(msg.channel.id,reply).then( m=> {
												console.log( "Responded: " + m.cleanContent );
											} );
										}
										
										return;
									}
								}
							}
						}
						
						this.cmdusage += 1;
						if ( bot.privateChannels.get( msg.guild.id ) ) {
							console.log( `DM: ${msg.author.id}: ${msg.author.username}#${msg.author.discriminator}: ${msg.cleanContent}` );
						} else {
							console.log( `${msg.guild.name}: ${msg.channel.name}: ${msg.author.username}#${msg.author.discriminator}: ${msg.cleanContent}` );
						}
						
						var qs = "";
						
						/*for ( let i in args ) {
							if ( i != 0 ) {
								args[i-1] = args[i];
								delete args[i];
							}
						}*/
						
						for ( let i in args ) {
							console.log( i + ": " + args[ i ] );
						}
						
						for ( let s in args ) {
							if ( s == 0 ) {
								qs += args[ s ];
							} else {
								qs += " " + args[ s ];
							}
						}
							
						var reply=cmd.payload(msg,args,qs);
						if (reply!=undefined&&reply!=null) {
							bot.createMessage(msg.channel.id,reply).then( m=>{
								console.log( "Responded: " + m.cleanContent );
							} );
						}
					}
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
	}
	
	unsetGuildPrefix( guildId ) {
		if ( guildId in this.gPrefixes )
			delete this.gPrefixes[ guildId ];
	}
}

module.exports=Handler;