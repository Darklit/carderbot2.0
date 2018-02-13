const Commando = require('discord.js-commando');
const ytdl = require('ytdl-core');

//Change Name
class QueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'View the current queue.',
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
      if(data.nowPlaying != "Nothing"){
        var queue = data.queue;
        var currentPlaying = data.nowPlaying;
        var queueMessage = "";
        var queueNum = 0;
        message.channel.startTyping();
        ytdl.getInfo(currentPlaying,{downloadURL:true}).then(info => {
          queueMessage = `Now playing: ${info.title}`;
          if(queue.length == 0){message.channel.stopTyping(); message.reply(queueMessage); }
          for(var i = 0; i < queue.length; i++){
            ytdl.getInfo(queue[i],{downloadURL:true}).then(dat => {
              queueMessage+=`\n${i}: ${dat.title}`;
              queueNum++;
              if(queueNum == queue.length){
                message.channel.stopTyping();
                message.reply(queueMessage);
              }
            }).catch(() => {
              queueMessage+=`\n${i}: ${queue[i]}`;
              queueNum++;
              console.log('error!');
            });
          }
        }).catch(console.error);
      }else message.reply("No queue!");
    }
  }
}

//End name
module.exports = QueueCommand;
