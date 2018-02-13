const Commando = require('discord.js-commando');

//Change Name
class SkipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      group: 'music',
      memberName: 'skip',
      description: 'Calls for a vote to skip a song.',
      guildOnly: true,

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
    var data = this.client.registry.resolveCommand('music:play').servers[message.guild.id];
    if(data !== undefined){
      data.dispatcher.stop();
      message.reply("Skipped!");
    }
  }
}

//End name
module.exports = SkipCommand;
