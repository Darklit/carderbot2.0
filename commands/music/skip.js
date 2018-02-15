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
    this.skipping = false;
  }

  run(message,args){
    if(!this.skipping){
      message.channel.send("Say I if you would like to skip the current song!").then(msg => {
        var memberCount = message.member.voiceChannel.members.array().length-1;
        var currentVotes = 1;
        var voted = [message.author.id];
        const filter = m => m.content.toLowerCase() == 'i';
        const collector = msg.channel.createMessageCollector(filter, {time: 10000});
        collector.on('collect', m => {
          var tries = 0;
          for(var i = 0; i < voted.length; i++){
            if(voted[i] != m.author.id) tries++;
            else break;
          }
          if(tries == voted.length){
            currentVotes++;
            voted[voted.length] = m.author.id;
          }
          message.channel.send(`${currentVotes} out of ${memberCount} voted`);
          if(currentVotes>=memberCount/2){
            collector.stop();
            this.client.registry.resolveCommand('music:play').servers[message.guild.id].dispatcher.end();
            message.channel.send("Skipped!");
          }
        });
        if(currentVotes>=memberCount/2){
          collector.stop();
          this.client.registry.resolveCommand('music:play').servers[message.guild.id].dispatcher.end();
          message.channel.send("Skipped!");
        }
      }).catch(console.error);
    }
  }
}

//End name
module.exports = SkipCommand;
