class Command {
	constructor( name, payload, options ) {
		this.name=name;
		this.payload=payload;
		
		this.subcommands = {};
		
		for ( let opt in options ) {
			if ( !( opt != "name" && opt != "payload" ) ) return;
			
			this[ opt ] = options[ opt ];
		}
	}
	
	registerSubcommand( name, payload, options ) {
		if (!name) throw new Error("No name for command.");
		if (!payload) throw new Error(`No payload for command "${name}".`);
		if (typeof(payload)!="function") throw new Error(`Command payload for "${name}" isn't a function.`);
		
		this.subcommands[name] = new Command( name, payload, options );
		return this.subcommands[name];
	}
	
	unregisterSubcommand( name ) {
		if ( name in this.subcommands )
			delete this.subcommands[ name ];
	}
}

module.exports = Command;