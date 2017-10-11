const Commando = require('discord.js-commando');
const config = require('../../config.js');

//Change Name
class ChangeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'change',
      group: 'admin',
      memberName: 'change',
      description: 'Just to change details of the bot.',
      guildOnly: false,


      args: [
        {
          key: 'type',
          prompt: 'What are you trying to change',
          type: 'string',
          validate: str => (str.toLowerCase() == 'name') || (str.toLowerCase() == 'avatar')
        },
        {
          key: 'value',
          prompt: 'What are you changing it to?',
          type: 'string'
        }
      ]

    });
  }

  run(message,args){
    if(message.author.id == config.ownerid){
      if(args.type.toLowerCase() == 'name'){
        this.client.user.setUsername(args.value).then(user => {
          message.reply(`My new name is ${user.username}`);
        })
        .catch(console.error);
      }else if(args.type.toLowerCase() == 'avatar'){
        this.client.user.setAvatar(args.value).then(user => {
          message.reply('Avatar changed');
        })
        .catch(console.error);
      }else{
        message.reply('Invalid arguments');
      }
    }else{
      message.reply('Invalid permissions');
    }
  }
}

//End name
module.exports = ChangeCommand;
