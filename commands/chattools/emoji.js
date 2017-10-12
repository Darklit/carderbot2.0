const Commando = require("discord.js-commando");
const fs = require('fs');
const proc = require('child_process');

//Change Name
class EmojiCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'emoji',
      group: 'chattools',
      memberName: 'emoji',
      description: 'Manipulate emojis',
      guildOnly: true,


      args: [
        {
          key: 'name',
          prompt: 'Enter the name of the emoji.',
          type: 'string',
          parse: str => str.toLowerCase()
        },
        {
          key: 'picture',
          prompt: 'Enter a working picture link.',
          type: 'string'
        }
      ]

    });
  }

  run(message,args){
    //message.reply("ehy!");
    if(message.member.hasPermission("MANAGE_EMOJIS")){
      var serverEmojis = message.guild.emojis;
      if(fs.existsSync('./commands/chattools/resize/emojis.txt')){
        fs.writeFileSync('./commands/chattools/resize/emojis.txt',args.picture);
      }else{
        fs.appendFileSync('./commands/chattools/resize/emojis.txt',args.picture);
      }
      var test = `${__dirname}/resize/start.bat`;
      console.log(__dirname);
      proc.execFile(test, function(err, stdout,stderr){
        if(err){
          return console.log(err);
        }
        console.log(stdout);
      });
      var emoStuff = () => {
        if(serverEmojis.exists("name",args.name)){
          message.guild.deleteEmoji(serverEmojis.find("name",args.name),"To be changed...");
          message.guild.createEmoji(`${__dirname}/resize/emojis.png`,args.name)
          .then(emo => {
            message.reply(`Emoji: ${emo} was created`);
          })
          .catch(err => {
            console.log(err);
            message.reply("Error while creating emoji!");
          });
        }else{
          message.guild.createEmoji(`${__dirname}/resize/emojis.png`,args.name)
          .then(emo => {
            message.reply(`Emoji: ${emo} was created`);
          })
          .catch(err => {
            console.log(err);
            message.reply("Error while creating emoji!");
          });
        }
      }
      var deleteFile = () =>{
        console.log("here");
        var file = './commands/chattools/resize/emojis.png';
        if(fs.existsSync(file)){
          fs.unlinkSync(file);
          console.log("File removed");
        }
      }
      message.channel.startTyping();
      setTimeout(emoStuff,10000);
      message.channel.stopTyping();
      setTimeout(deleteFile,11000);
    }
  }
}

module.exports = EmojiCommand;
