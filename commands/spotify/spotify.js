const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');

//Change Name
class SpotifyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'spotify',
      group: 'spotify',
      memberName: 'spotify',
      description: 'Authenticate your spotify account!',
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
    firebase.database().ref('users').child(message.author.id).child('displayName').once('value').then(snap => {
      if(snap.exists()){
        firebase.database().ref('users').child(message.author.id).child('spotify').child('token').once('value').then(data => {
          if(data.exists()){
            message.author.createDM().then(channel => channel.send("You have already authenticated!"));
          }else{
            message.author.createDM().then(channel => channel.send("Go to https://carder-bot.firebaseapp.com/spotify/" + message.author.id + " to authenticate"));
            firebase.database().ref('users').child(message.author.id).child('spotify').child('code').on('value',(dat) => {
              if(dat.exists()){
                methods.authenticate(dat.val(),message.author.id);
                message.author.createDM().then(channel => channel.send("You have authenticated! Thank you."));
                firebase.database().ref('users').child(message.author.id).child('spotify').child('code').off();
              }
            });
          }
        }).catch(console.error);
      }else{
        methods.addUser(message.author).then(()=>{
          message.author.createDM().then(channel => channel.send("Go to https://carder-bot.firebaseapp.com/spotify/" + message.author.id + " to authenticate"));
          firebase.database().ref('users').child(message.author.id).child('spotify').child('code').on('value',(dat) => {
            if(dat.exists()){
              message.author.createDM().then(channel => channel.send("You have authenticated! Thank you."));
              methods.authenticate(dat.val(),message.author.id);
              firebase.database().ref('users').child(message.author.id).child('spotify').child('code').off();
            }
          });
        }).catch(console.error);
      }
    }).catch(console.error);
  }
}

module.exports = SpotifyCommand;
