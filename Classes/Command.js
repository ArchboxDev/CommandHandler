class Command {
	constructor( name, payload, options ) {
		this.name=name;
		this.payload=payload;
		
		for ( let opt in options ) {
			if ( !( opt != "name" && opt != "payload" ) ) return;
			
			this[ opt ] = options[ opt ];
		}
	}
}

module.exports = Command;