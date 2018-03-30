const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');

//Change Name
class MoneyListCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'moneylist',
      group: 'economy',
      memberName: 'moneylist',
      description: 'Get the top 10 people with the most money.',
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
    firebase.database().ref('money').orderByValue().limitToFirst(10).once('value').then(snap => {
      console.log(snap.val());
    });
  }
}

module.exports = MoneyListCommand;
