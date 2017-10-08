const Commando = require('discord.js-commando');
const fs = require('fs');
const config = require('../../config.js');

//Change Name
class ClearCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      group: 'chattools',
      memberName: 'clear',
      description: 'Clears the chat of a certain person and/or a certain amount',
      guildOnly: true,


      args: [
        {
          key: 'amount',
          prompt: 'How many messages would you like to delete?',
          type: 'integer',
          max: 100
        },
        {
          key: 'user',
          prompt: "Who's messages would you like to delete?",
          type: 'string',
          default: '',
          parse: str => str.toLowerCase()
        }
      ]

    });
  }

  run(message,args){
    var messageDel = 0;
    var members = message.channel.members.array();

  }
}

//End name
module.exports = ClearCommand;
