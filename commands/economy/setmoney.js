const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');

//Change Name
class SetMoneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setmoney',
      group: 'economy',
      memberName: 'setmoney',
      description: 'Set the money of the user',
      guildOnly: true,


      args: [
        {
          key: 'user',
          prompt: "Who's the target?",
          type: 'string'
        },
        {
          key: 'amount',
          prompt: "How much money?",
          type: 'integer',
          validate: m => m > 0
        }
      ]

    });
  }

  run(message,args){
    methods.checkPermission(message.member,'setmoney',message.guild.id).then(res => {
      if(res){
        var member = methods.findUser(args.user,message.guild);
        if(member !== null){
          firebase.database().ref('users').child(member.user.id).child('money').once('value').then(snap => {
            if(snap.exists()){
              firebase.database().ref('users').child(member.user.id).child('money').set(args.amount);
              message.reply("Money set");
            }else{
              methods.addUser(member.user).then(()=> {
                firebase.database().ref('users').child(member.user.id).child('money').set(args.amount).then(()=>{
                  message.reply("Money set");
                }).catch(console.error);
              }).catch(console.error);
            }
          }).catch(console.error);
        }
      }else{
        message.reply("You don't have that permission!");
      }
    }).catch(console.error);
  }
}

module.exports = SetMoneyCommand;
