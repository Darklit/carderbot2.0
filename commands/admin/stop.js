const Commando = require('discord.js-commando');
const config = require('../../config.js');
//Change Name
class StopCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      group: 'admin',
      memberName: 'stop',
      description: 'Stops the bot.',
      guildOnly: false,

      /*
      args: [
        {
          key: 'name',
          prompt: 'Enter this...',
          type: 'variable type'
        }
      ]
      */
    });
  }

  run(message,args){
    if(message.author.id == config.ownerid){
      var useClient = this.client;
      message.reply("Shutting down...");
      setTimeout(function(){
        console.log("closed");
        useClient.destroy();
        process.exit();
      }, 1000);
    }else{
      console.log(message.author.id);
      console.log(config.owner)
       message.reply("You can't do that!");
    }
  }
}

//End name
module.exports = StopCommand;
