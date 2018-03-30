const Commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.6};
const rp = require('request-promise');
const YouTube = require('youtube-node');
const config = require('../../config.js');
var youTube = new YouTube;
youTube.setKey(config.youtube);

//Change Name
class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Plays a YouTube video.',
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
    this.servers = {};
    for(var i = 0; i < client.guilds.array().length; i++){
      if(client.guilds.array()[i].available) this.servers[client.guilds.array()[i].id] = {
        dispatcher: {},
        playing: false,
        queue: [],
        nowPlaying: "Nothing"
      };
    }
    console.log('constructed');
  }

  run(message,args){
    if(ytdl.validateURL(args)){
      if(this.servers[message.guild.id] !== undefined){
        if(this.servers[message.guild.id].playing){ this.servers[message.guild.id].queue.push(args); message.reply("Added to queue");}
        else{ this.servers[message.guild.id].nowPlaying = args; console.log(args);}
        if(!this.servers[message.guild.id].playing){
          if(message.member.voiceChannel !== undefined && message.member.voiceChannel !== null){
            this.playMusic(message);
          }
        }
      }else this.getGuilds(this.client,message,args);
    }else{
      youTube.addParam('type','video');
      youTube.addParam('videoCategoryId','music');
      youTube.addParam('order','viewCount');
      youTube.search(args,5,(err,res) => {
        if(!err){
          var videos = res.items;
          var videoList = [];
          var index = 1;
          for(var i in videos){
            videoList.push(`${index}: ${videos[i].snippet.title}`);
            index++;
          }
          if(videoList.length == videos.length){
            var stringVersion = '';
            for(var g in videoList){
              stringVersion+=videoList[g]+'\n';
            }
            message.reply(stringVersion).then(mes => {
              var filter = m => !isNaN(m.content) && message.author.id == m.author.id
              var collector = mes.channel.createMessageCollector(filter, {time: 12000});
              collector.on('collect', m => {
                m.delete().then(useless => {
                  mes.edit(videoList[m.content-1]);
                });
                console.log(videos[m.content-1]);
                var song = videos[m.content-1].id.videoId;
                console.log(song);
                if(this.servers[message.guild.id] !== undefined){
                  if(this.servers[message.guild.id].playing){ this.servers[message.guild.id].queue.push(song); message.reply("Added to queue");}
                  else{ this.servers[message.guild.id].nowPlaying = song; console.log(song);}
                  if(!this.servers[message.guild.id].playing){
                    if(message.member.voiceChannel !== undefined && message.member.voiceChannel !== null){
                      this.playMusic(message);
                    }
                  }
                }else this.getGuilds(this.client,message,args);
                collector.stop();
              });
            })
          }
        }else{
          console.reply(JSON.stringify(res,null,5));
        }
      });
    }
  }

  playMusic(message){
    message.member.voiceChannel.join().then(connection => {
      const stream = ytdl(this.servers[message.guild.id].nowPlaying, {filter: 'audioonly'});
      this.servers[message.guild.id].dispatcher = connection.playStream(stream,streamOptions);
      this.servers[message.guild.id].playing = true;
      this.servers[message.guild.id].dispatcher.on('end',reason => {
        if(reason !== undefined){
          if(reason.toLowerCase().includes('stream is') || reason.toLowerCase().includes('user')){
            if(this.servers[message.guild.id].queue.length>=1){
              this.servers[message.guild.id].nowPlaying = this.servers[message.guild.id].queue[0];
              var q = this.servers[message.guild.id].queue;
              var newQueue = [];
              for(var i = 0; i < q.length; i++){
                if(i!=0) newQueue.push(q[i]);
              }
              this.servers[message.guild.id].queue = newQueue;
              this.playMusic(message);
            }else{
              this.servers[message.guild.id].nowPlaying = "Nothing";
              this.servers[message.guild.id].playing = false;
              this.servers[message.guild.id].dispatcher = {};
              message.member.voiceChannel.leave();
            }
          }
        }
      });
    }).catch((err)=>{
      console.log(err);
      message.reply('You need to join a voice channel first!');
    });
  }

  getGuilds(client,message,args){
    this.servers = {};
    for(var i = 0; i < client.guilds.array().length; i++){
      if(client.guilds.array()[i].available) this.servers[client.guilds.array()[i].id] = {
        dispatcher: {},
        playing: false,
        queue: [],
        nowPlaying: "Nothing"
      };
    }
    this.run(message,args);
  }
}

//End name
module.exports = PlayCommand;
