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
  }

  run(message,args){
    this.setup(message);
    if(message.member.voiceChannel != undefined){
      var guildName = message.guild.name.toLowerCase();
      if((args.toLowerCase().includes('youtube.com/watch?')) || (args.toLowerCase().includes('youtu.be'))){
        if(this.data[guildName].playing){
          this.data[guildName].songs[this.data[guildName].songs.length] = args;
          message.reply('Song added to queue!');
        }else{
          this.data[guildName].songs[0] = args;
          this.playMusic(message,this.data[guildName].songs[0]);
        }
      }
    }else{
      message.reply('Join a voice channel first!');
    }
  }
  setup(message){
    if(this.data == undefined){
      this.data = {};
    }
    if(!(this.data[message.guild.name.toLowerCase()])){
      var jso = {
        songs : [

        ],
        queuenum: 0,
        playing: false,
        voiceChannel: null,
        dispatcher: null
      };
      this.data[message.guild.name.toLowerCase()] = jso;
    }
  }
  playMusic(message,link){
    var guildName = message.guild.name.toLowerCase();
    this.data[guildName].voiceChannel = message.member.voiceChannel;
    this.data[guildName].voiceChannel.join().then(connection => {
      this.data[guildName].playing = true;
      const stream = ytdl(link, {filter: 'audioonly'});
      this.data[guildName].dispatcher = connection.playStream(stream,streamOptions);
      this.data[guildName].dispatcher.on('end',reason => {
        if((reason.toLowerCase().includes('stream is')) || (reason.toLowerCase() == 'user')){
          var index = this.data[guildName].songs.indexOf(link);
          if((this.data[guildName].songs[index+1] != undefined) && (this.data[guildName].songs[index+1] != '')){
            this.data[guildName].songs[index] = '';
            this.playMusic(message,this.data[guildName].songs[index+1]);
          }else{
            var jso = {
              songs : [

              ],
              queuenum: 0,
              playing: false,
              voiceChannel: null,
              dispatcher: null
            };
            this.data[guildName].voiceChannel.leave();
            this.data[guildName] = jso;
          }
        }else{
          console.log(reason);
        }
      })
    })
  }
}

//End name
module.exports = PlayCommand;
