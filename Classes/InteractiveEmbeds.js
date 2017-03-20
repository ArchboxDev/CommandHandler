// ◀ ⬅ 🔒 ➡ ▶ //

class EmbedManager {
	constructor( handler ) {
		this.Handler = handler;
		
		this.ReactionInstruction;
		this.InteractiveEmbed;
	}
	
	class ReactionInstruction {
		constructor( reaction, onclick ) {
			this.Reaction = reaction;
			this.OnClick = onclick;
		}
	}
	this.ReactionInstruction - ReactionInstruction;
	
	class InteractiveEmbed {
		constructor( Embeds = [] ) {
			this.ChannelID;
			this.MessageID;
			
			this.Locked = false;
			
			this.Embeds = Embeds;
			if ( !this.Embeds[0] )
				this.Embeds.push( { description: "Nothing.", color: 15760895 } );
			
			this.Embed = Embeds[ Math.floor( ( this.Embeds.length - 1 ) / 2 ) ];
			
			this.Reactions = [
				ReactionInstruction( "◀", () => { // First Entry //
					this.Embed = Embeds[ 0 ];
					this.UpdateMessage();
				} ),
				ReactionInstruction( "⬅", () => { // Previous Entry //
					let New = this.Embeds[ this.Embeds.indexOf( this.Embed ) - 1 ];
					if ( New ) {
						this.Embed = New;
						this.UpdateMessage();
					}
				} ),
				ReactionInstruction( "🔒", () => { // Lock Entries
					this.Locked = true;
				} ),
				ReactionInstruction( "➡", () => { // Next Entry //
					let New = this.Embeds[ this.Embeds.indexOf( this.Embed ) + 1 ];
					if ( New ) {
						this.Embed = New;
						this.UpdateMessage();
					}
				} ),
				ReactionInstruction( "▶", () => { // Last Entry
					this.Embed = this.Embeds[ this.Embeds.length - 1 ];
					this.UpdateMessage();
				} )
			];
		}
		
		Create( ChannelID ) {
			this.Handler.bot.createMessage( ChannelID, { embed: this.Embed } ).then( m => {
				this.ChannelID = m.channel.id;
				this.MessageID = m.id;
			} ).catch( e => {
				throw err;
			} );
		}
		
		UpdateMessage() {
			
		}
	}
	this.InteractiveEmbed = InteractiveEmbed;
}

module.exports = EmbedManager;