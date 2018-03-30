const Commando = require("discord.js-commando");
const firebase = require('firebase');

//Change Name
class MoneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'money',
      group: 'economy',
      memberName: 'money',
      description: 'Get your money!',
      guildOnly: false,

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
    message.channel.startTyping();
    firebase.database().ref('/money').child(`${message.author.id}`).once('value').then((snap) => {
      if(snap.val() === null){
        var user = 100;
        firebase.database().ref('/money').child(`${message.author.id}`).set(user);
        message.reply("You have 100 dollars!");
        message.channel.stopTyping();
      }else{
        console.log(snap.val());
        message.reply(`You have ${snap.val()} dollars!`);
        message.channel.stopTyping();
      }
    }).catch(console.error);
  }
}

module.exports = MoneyCommand;
