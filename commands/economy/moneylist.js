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
      this.getMoneyList(message.guild).then(moneyList => {
          var newMoney = moneyList.sort(function(a,b))
      }).catch(console.error);
  }
  
  getMoneyList(guild){
      return new Promise((fulfill,reject) => {
         var members = guild.members.array();
          var moneyList = [];
          var error = 0;
          for(var i = 0; i < members.length; i++){
              firebase.database().ref('users').child(members[i].user.id).child('money').once('value').then(snap => {
                  if(snap.exists()){
                      moneyList.push({
                          money: snap.val(),
                          displayName: members[i].displayName
                      });
                  }else error++;
                  if(error+moneyList.length == members.length) fulfill(moneyList);
              }).catch(console.error);
          } 
      });
  }
}

module.exports = MoneyListCommand;
