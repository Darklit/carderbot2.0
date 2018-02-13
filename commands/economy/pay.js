const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');

//Change Name
class PayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'pay',
      group: 'economy',
      memberName: 'pay',
      description: 'Pay someone your hard earned money.',
      guildOnly: true,


      args: [
        {
          key: 'name',
          prompt: 'Who are you paying money to?',
          type: 'string'
        },
        {
          key: 'amount',
          prompt: 'How much are you paying?',
          type: 'integer',
          validate: num => num>0
        }
      ]

    });
  }

  run(message,args){
    message.channel.startTyping();
    if(message.guild.available){
      var members = message.guild.members.array();
      for(var i = 0; i < members.length; i++){
        if(members[i].displayName.toLowerCase() == args.name.toLowerCase()){
          firebase.database().ref('/users').child(`${members[i].user.id}`).once('value').then(snap => {
            if(snap.val() === null){
              methods.addUser(members[i].user).then(() => {
                this.processMoney(message,args,members[i].user.id);
              }).catch();
            }else{
              this.processMoney(message,args,members[i].user.id);
            }
          }).catch(console.error);
          break;
        }
      }
    }
  }

  processMoney(message,args,id){
    firebase.database().ref('/users').child(`${message.author.id}`).child('money').once('value').then(snap => {
      if(snap.val() !== null){
        let money = snap.val();
        firebase.database().ref('/users').child(`${id}`).child('money').once('value').then(data => {
          if(data.val() !== null){
            let money2 = data.val();
            if(money>=args.amount){
              money-=args.amount;
              money2+=args.amount;
              firebase.database().ref('/users').child(`${id}`).child('money').set(money2);
              firebase.database().ref('/users').child(`${message.author.id}`).child('money').set(money);
              message.channel.stopTyping();
              message.reply("Money paid!");
            }else{
              message.channel.stopTyping();
              message.reply("Insufficient funds!");
            }
          }
        }).catch(console.error);
      }
    }).catch(console.error);
  }
}

module.exports = PayCommand;
