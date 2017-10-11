const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');

//Change Name
class ForceSkipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'forceskip',
      group: 'music',
      memberName: 'forceskip',
      description: 'Skips the song forcefully.',
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
    if(message.author.id == config.ownerid){
      var guildName = message.guild.name.toLowerCase();
      this.client.registry.resolveCommand('music:play').data[guildName].dispatcher.end();
      message.reply('Skipped!');
    }
  }
}

//End name
module.exports = ForceSkipCommand;
