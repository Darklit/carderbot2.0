const Commando = require("discord.js-commando");
const firebase = require('firebase');

//Change Name
class JoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'join',
      group: 'music',
      memberName: 'join',
      description: 'Join channel',
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
    message.member.voiceChannel.join();
  }
}

module.exports = JoinCommand;
