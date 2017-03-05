var bot = require("./bot.js");

const CommandHandler=require("./commands/handler.js"),
	Commands=new CommandHandler(bot,"a.")

module.exports=Commands;