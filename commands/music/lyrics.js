const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');
const config = require('./../../config.js');
const rp = require('request-promise');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

//Change Name
class LyricsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      group: 'music',
      memberName: 'lyrics',
      description: 'Get the lyrics of a song.',
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
    var options = {
      url: 'https://api.genius.com/search',
      qs: {
        q: args
      },
      headers: {
        'Authorization': 'Bearer ' + config.genius.token
      },
      json: true
    };
    rp(options).then(data => {
      var string = '';
      var hits = data.response.hits;
      var index = 1;
      for(var i in hits){
        string+=`${index}: ${hits[i].result.full_title}\n`;
        index++;
      }
      message.reply(string).then(msg => {
        const filter = m => m.author.id == message.author.id && !isNaN(m.content);
        var collector = msg.channel.createMessageCollector(filter,{time: 120000});
        collector.on('collect',(mes) => {
          var song = hits[mes.content-1];
          options = {
            url: `https://api.genius.com/songs/${song.result.id}`,
            headers: {
              'Authorization': 'Bearer ' + config.genius.token
            },
            json: true
          };
          rp(options).then(dat => {
            message.reply(dat.response.song.url);
            this.getLyrics(message,dat.response.song.url);
          }).catch(console.error);
          collector.stop();
        });
      }).catch(console.error);
    }).catch((err) => {
      console.log(err);
    });
  }

  async getLyrics(message,url){ //I'm a filthy thief, here is who actually wrote the scraping code: https://github.com/scf4/lyricist
    var response = await fetch(url);
    var text = await response.text();
    var bleh = cheerio.load(text);
    var lyrics = (bleh('.lyrics').text().trim());
    var messages = [];
    var charCount = 0;
    var index = 0;
    for(var i = 0; i < lyrics.length/2000; i++){
      messages[i] = '';
    }
    for(var i = 0; i < lyrics.length; i++){
      messages[index] += lyrics.charAt(i);
      charCount++;
      if(charCount>=1999){ index++; charCount = 0;}
    }
    for(var i = 0; i < messages.length; i++){
      message.channel.send(messages[i]);
    }
  }
}

module.exports = LyricsCommand;
