const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');
const methods = require('./../../methods.js');

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
    methods.checkPermission(message.member,'forceskip',message.guild.id).then(res => {
      if(message.author.id == config.ownerid || res){
        var data = this.client.registry.resolveCommand('music:play').servers[message.guild.id];
        if(data !== undefined){
          data.dispatcher.end();
          message.reply("Skipped!");
        }
      }
    }).catch(console.error);
  }
}

//End name
module.exports = ForceSkipCommand;
