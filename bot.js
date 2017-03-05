var Token=require("./bot.json").token;

const Eris=require("eris"),
	bot=new Eris.Client(Token)

module.exports=bot;