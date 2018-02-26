const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');

//Change Name
class SlotCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'slots',
      group: 'fun',
      memberName: 'slots',
      description: 'Play the slot machine!',
      guildOnly: true,

      
      args: [
        {
          key: 'money',
          prompt: 'How much are you putting into it?',
          type: 'integer',
          validate: m => m>0
        }
      ]
      
    });
  }

  run(message,args){
      firebase.database().ref('users').child(message.author.id).child('money').once('value').then(snap => {
          if(snap.exists()){
              var amount = snap.val();
              if(amount>=args.money){
                  var gameData = this.playGame(args.money);
                  message.channel.send(`${gameData.emoji1} ${gameData.emoji2} ${gameData.emoji2}`);
                  if(gameData.winnings == 0){
                      snap.ref.set(amount-args.money);
                      message.reply("You lost!");
                  }else{
                      snap.ref.set(amount+gameData.winnings);
                      message.reply(`You won ${gameData.winnings}!`);
                  }
              }else{
                  message.reply("Insufficient funds!");
              }
          }else{
              methods.addUser(message.user).then(()=> {
                  firebase.database().ref('users').child(message.author.id).child('money').once('value').then(data => {
                      if(data.exists()){
                          var amount = data.val();
                          if(amount>=args.money){
                              var gameData = this.playGame(args.money);
                              message.channel.send(`${gameData.emoji1} ${gameData.emoji2} ${gameData.emoji2}`);
                              if(gameData.winnings == 0){
                                  data.ref.set(amount-args.money);
                                  message.reply("You lost!");
                              }else{
                                  data.ref.set(amount+gameData.winnings);
                                  message.reply(`You won ${gameData.winnings}!`);
                              }
                          }else{
                              message.reply("Insufficient funds!");
                          }
                      }else{
                          message.reply("Error!");
                      }
                  }).catch(console.error);
              })
          }
      }).catch(console.error);
  }
  
  playGame(bet){
      const emojis = [
          '🤔',
          '😂',
          '💩',
          '💰',
          '👌',
          '🐘'
       ];
       var index1 = Math.floor(Math.random()*emojis.length);
       var index2 = Math.floor(Math.random()*emojis.length);
       var index3 = Math.floor(Math.random()*emojis.length);
       var emoji1 = emojis[index1];
       var emoji2 = emojis[index2];
       var emoji3 = emojis[index3];
       if(index1 == index2 && index1 == index2){
           console.log('won!');
           var money = 0;
           switch(emoji1){
               case emojis[0]:
                   money = bet*(Math.floor(Math.random()*4))+1;
                   break;
               case emojis[1]:
                   money = bet*2;
                   break;
               case emojis[2]:
                   money = bet-1;
                   break;
               case emojis[3]:
                   money = bet*bet;
                   break;
               case emojis[4]:
                   money = bet*4;
                   break;
               case emojis[5]:
                   money = bet+(bet*2);
                   break;
                default:
                    console.log('oof');
                    money = 0;
                    break;
           }
           return {
               emoji1: emoji1,
               emoji2: emoji2,
               emoji3: emoji3,
               winnings: money
           };
       }else{
           console.log(`${index1} ${index2} ${index3}`);
           return {
               emoji1: emoji1,
               emoji2: emoji2,
               emoji3: emoji3,
               winnings: 0
           };
       }
        
  }
}

module.exports = SlotCommand;
