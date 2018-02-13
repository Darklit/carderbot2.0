const Commando = require('discord.js-commando');
const fs = require('fs');
const config = require('../../config.js');
//const methods = require('../../methods.js');
const request = require('request');

//Change Name
class SearchCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'search',
      group: 'chattools',
      memberName: 'search',
      description: 'Search wikipedia',
      guildOnly: false,


      args: [
        {
          key: 'term',
          prompt: 'What are you searching for?',
          type: 'string'
        }
      ]

    });
  }

  run(message,args){
    request.post({
      uri: `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${args.term}`,
      allowAllRedirects: true
    }, (error,response,body) =>{
      console.log('error:',error);
      if(response.statusCode == 200){
        var newString = '';
        var bodyObj = JSON.parse(body);
        var jsonObj = {
          search: bodyObj[Object.keys(bodyObj)[0]],
          terms: bodyObj[Object.keys(bodyObj)[1]],
          definitions: bodyObj[Object.keys(bodyObj)[2]],
          sites: bodyObj[Object.keys(bodyObj)[3]]
        };
        var termNum = 0;
        const filter = m => (m.content.toLowerCase() == 'no' || m.content.toLowerCase() == 'yes') && m.author.id != config.botid && m.author.id == message.author.id;
        const retry = () =>{
          termNum++;
          if(jsonObj.terms[termNum] == undefined){
            message.reply('No remaining terms.');
          }else{
            message.channel.send('Is this what you were looking for?');
            message.channel.awaitMessages(filter, {max:1,time:60000,errors: ['time']}).then(collected => {
              if(collected.array()[0].content.toLowerCase() == 'no'){
                message.reply(`**${jsonObj.terms[termNum]}**: ${jsonObj.definitions[termNum]}`);
                retry();
              }else{
                message.reply("Happy to help!");
              }
            })
            .catch(console.error);
          }
        }
        if(jsonObj.definitions[0] != undefined){
          if(jsonObj.definitions[0].toLowerCase().includes(`${jsonObj.terms[0].toLowerCase()} may refer to:`)){
            message.reply(`**${jsonObj.terms[1]}**: ${jsonObj.definitions[1]}`);
            termNum++;
            retry();
          }else{
            message.reply(`**${jsonObj.terms[0]}**: ${jsonObj.definitions[0]}`);
            retry();
          }
        }else{
          message.reply(`Couldn't search that!`);
        }
      }
    });
  }
}

//End name
module.exports = SearchCommand;
