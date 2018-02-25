const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');
const config = require('./../../config.js');

//Change Name
class PermissionCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'permission',
      group: 'admin',
      memberName: 'permission',
      description: 'Set the permissions of others',
      guildOnly: true,


      args: [
        {
          key: 'type',
          prompt: 'Are you adding or removing',
          type: 'string',
          validate: str => (str == "add" || str == "remove")
        },
        {
          key: 'permission',
          prompt: 'What permission are you adding?',
          type: 'string'
        },
        {
          key: 'name',
          prompt: 'Who are you adding the permission to?',
          type: 'string'
        }
      ]

    });
  }

  run(message,args){
    methods.checkPermission(message.member,'permission',message.guild.id).then(res => {
      if(res || message.author.id == message.guild.ownerID || message.author.id == config.ownerid){
        var member = methods.findUser(args.name,message.guild);
        if(member !== null){
          var hasPermission = args.type == "add";
          firebase.database().ref('permissions').child(message.guild.id).child(member.user.id).child(args.permission).set(hasPermission);
          message.reply("Permission set");
        }
      }
    }).catch(console.error);
  }
}

module.exports = PermissionCommand;
