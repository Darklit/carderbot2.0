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
          max: 99
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
    var delMessages = [];
    if(args.user == ''){
      message.channel.bulkDelete(args.amount+1).then(msgs => {
        message.reply(msgs.array().length-1 + " messages deleted.");
      })
      .catch(err => {
        message.reply("Error deleting messages!");
        message.reply(err.message);
      });
    }else{
      message.channel.fetchMessages({limit:100}).then(msgs => {
        var mess = msgs.array();
        for(var i = 0; i < mess.length; i++){
          if(mess[i].member.displayName.toLowerCase() == args.user){
            delMessages[delMessages.length] = mess[i];
          }
          if(delMessages.length >= args.amount){
            break;
          }
        }
        message.channel.bulkDelete(delMessages).then(mes => {
          message.reply(`${mes.array().length} messages deleted.`);
        })
        .catch(err =>{
          message.reply("Error deleting messages!");
          message.reply(err.message);
        });
      }).catch(console.error);
    }
  }
  deleteMethod2(){

  }
}

//End name
module.exports = ClearCommand;
