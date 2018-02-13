const Commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1};

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
    if(this.servers[message.guild.id] !== undefined){
      if(this.servers[message.guild.id].playing){ this.servers[message.guild.id].queue.push(args); message.reply("Added to queue");}
      else{ this.servers[message.guild.id].nowPlaying = args; console.log(args);}
      if(!this.servers[message.guild.id].playing){
        if(message.member.voiceChannel !== undefined && message.member.voiceChannel !== null){
          this.playMusic(message);
        }
      }
    }else this.getGuilds(this.client);
  }

  playMusic(message){
    message.member.voiceChannel.join().then(connection => {
      const stream = ytdl(this.servers[message.guild.id].nowPlaying, {filter: 'audioonly'});
      this.servers[message.guild.id].dispatcher = connection.playStream(stream,streamOptions);
      this.servers[message.guild.id].playing = true;
      this.servers[message.guild.id].dispatcher.on('end',reason => {
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
      })
    });
  }

  getGuilds(client){
    this.servers = {};
    for(var i = 0; i < client.guilds.array().length; i++){
      if(client.guilds.array()[i].available) this.servers[client.guilds.array()[i].id] = {
        dispatcher: {},
        playing: false,
        queue: [],
        nowPlaying: "Nothing"
      };
    }
  }
}

//End name
module.exports = PlayCommand;
